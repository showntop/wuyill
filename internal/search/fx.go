package search

import (
	"go.uber.org/fx"

	"github.com/showntop/wuyill/internal/search/app"
)

// Module ...
var Module = fx.Module("search",
	// fx.Provide(repository.NewSpaceRepository, repository.NewMemberRepository),
	fx.Provide(app.NewApplication),
)
