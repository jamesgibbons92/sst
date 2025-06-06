package dev

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"reflect"

	"github.com/sst/sst/v3/cmd/sst/mosaic/deployer"
	"github.com/sst/sst/v3/pkg/bus"
	"github.com/sst/sst/v3/pkg/project"
	"github.com/sst/sst/v3/pkg/server"
	"golang.org/x/sync/errgroup"
)

type Message struct {
	Type  string          `json:"type"`
	Event json.RawMessage `json:"event"`
}

func Start(ctx context.Context, p *project.Project, server *server.Server) error {
	var complete *project.CompleteEvent
	var wg errgroup.Group

	log := slog.Default().With("service", "dev")
	log.Info("starting")
	defer log.Info("done")

	wg.Go(func() error {
		evts := bus.Subscribe(&project.CompleteEvent{})
		for {
			select {
			case <-ctx.Done():
				return nil
			case evt := <-evts:
				complete = evt.(*project.CompleteEvent)
			}
		}
	})

	server.Mux.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "application/x-ndjson")
		w.WriteHeader(http.StatusOK)
		log.Info("subscribed", "addr", r.RemoteAddr)
		flusher, _ := w.(http.Flusher)
		flusher.Flush()
		ctx := r.Context()
		events := bus.SubscribeAll()
		defer bus.Unsubscribe(events)
		if complete != nil {
			go func() {
				events <- complete
			}()
		}
		for {
			select {
			case <-ctx.Done():
				return
			case event := <-events:
				t := reflect.TypeOf(event)
				if t.Kind() == reflect.Ptr {
					t = t.Elem()
				}
				bytes, _ := json.Marshal(event)
				data, _ := json.Marshal(&Message{
					Type:  t.String(),
					Event: json.RawMessage(bytes),
				})
				w.Write(data)
				flusher.Flush()
			}
		}
	})

	server.Mux.HandleFunc(("/api/deploy"), func(w http.ResponseWriter, r *http.Request) {
		log.Info("deploy requested")
		bus.Publish(&deployer.DeployRequestedEvent{})
	})

	server.Mux.HandleFunc("/api/env", func(w http.ResponseWriter, r *http.Request) {
		directory := r.URL.Query().Get("directory")
		name := r.URL.Query().Get("name")
		cwd, _ := os.Getwd()
		for _, d := range complete.Devs {
			full := filepath.Join(cwd, d.Directory)
			log.Info("matching dev", "full", full, "directory", directory)
			if (directory != "" && full == directory) || (name != "" && d.Name == name) {
				env, err := p.EnvFor(ctx, complete, d.Name)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				body, err := json.Marshal(map[string]interface{}{
					"env":     env,
					"command": d.Command,
				})
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)
				w.Write(body)
				return
			}
		}
		log.Info("dev not found", "directory", directory)
		http.Error(w, "dev not found", http.StatusNotFound)
		return
	})

	server.Mux.HandleFunc("/api/completed", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(complete)
		return
	})

	return wg.Wait()
}

func Stream(ctx context.Context, url string, types ...interface{}) (chan any, error) {
	out := make(chan any)
	req, err := http.NewRequestWithContext(ctx, "GET", url+"/stream", nil)
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	decoder := json.NewDecoder(resp.Body)

	registry := map[string]reflect.Type{}
	for _, v := range types {
		t := reflect.TypeOf(v)
		if t.Kind() == reflect.Ptr {
			t = t.Elem()
		}
		name := t.String()
		registry[name] = t
	}

	go func() {
		defer close(out)
		defer resp.Body.Close()
		for {
			select {
			case <-ctx.Done():
				return
			default:
				var msg Message
				err := decoder.Decode(&msg)
				if err != nil {
					return
				}
				prototype, ok := registry[msg.Type]
				if !ok {
					continue
				}
				target := reflect.New(prototype).Interface()
				err = json.Unmarshal(msg.Event, target)
				if err != nil {
					continue
				}
				out <- target
			}
		}
	}()

	return out, nil
}

type EnvResponse struct {
	Env     map[string]string `json:"env"`
	Command string            `json:"command"`
}

func Env(ctx context.Context, query string, url string) (*EnvResponse, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", url+"/api/env?"+query, nil)
	if err != nil {
		return nil, err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result EnvResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func Deploy(ctx context.Context, url string) error {
	req, err := http.NewRequestWithContext(ctx, "POST", url+"/api/deploy", nil)
	if err != nil {
		return err
	}
	_, err = http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	return nil
}

func Completed(ctx context.Context, url string) (*project.CompleteEvent, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", url+"/api/completed", nil)
	if err != nil {
		return nil, err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result project.CompleteEvent
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
