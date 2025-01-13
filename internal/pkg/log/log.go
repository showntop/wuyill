package log

import (
	"context"
	"log"
)

// DebugContextf ...
func DebugContextf(ctx context.Context, format string, v ...interface{}) {
	log.Printf(format, v...)
}

// InfoContextf ...
func InfoContextf(ctx context.Context, format string, v ...interface{}) {
	log.Printf(format, v...)
}

// WarnContextf ...
func WarnContextf(ctx context.Context, format string, v ...interface{}) {
	log.Printf(format, v...)
}

// ErrorContextf ...
func ErrorContextf(ctx context.Context, format string, v ...interface{}) {
	log.Printf(format, v...)
}

// FatalContextf ...
func FatalContextf(ctx context.Context, format string, v ...interface{}) {
	log.Printf(format, v...)
}

// FatalContext ...
func FatalContext(ctx context.Context, format string, v ...interface{}) {
	log.Printf(format, v...)
}
