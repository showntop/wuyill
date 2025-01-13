package domain

import "github.com/showntop/llmack/workflow"

var (
	startNode = workflow.Node{
		ID:   "start_1",
		Name: "start",
		Kind: workflow.NodeKindStart,
		Inputs: workflow.Parameters{
			"query": workflow.Parameter{
				Name:  "query",
				Value: "{{query}}",
			},
		},
	}
	searchNode = workflow.Node{
		ID:   "search",
		Name: "search",
		Kind: workflow.NodeKindTool,
		Metadata: map[string]any{
			"provider_id":   7,
			"provider_kind": "code",
			"tool_name":     "ai_search",
		},
		Inputs: workflow.Parameters{
			"query": workflow.Parameter{
				Name:  "query",
				Value: "{{query}}",
			},
		},
		Outputs: workflow.Parameters{
			"result": workflow.Parameter{
				Name: "result",
				Type: "json",
			},
		},
	}
	exprNode = workflow.Node{
		ID:   "expr",
		Name: "expr",
		Kind: workflow.NodeKindExpr,
		Metadata: map[string]any{
			"expr": `map(get(fromJSON(input),"organic"), {.link})`,
		},
		Inputs: workflow.Parameters{
			"urls": workflow.Parameter{
				Name:  "input",
				Value: "{{search.result}}",
			},
		},
		// Outputs: workflow.Parameters{
		// 	"urls": workflow.Parameter{
		// 		Name: "urls",
		// 		Type: "json",
		// 	},
		// },
	}
	exprNode2 = workflow.Node{
		ID:   "expr2",
		Name: "expr2",
		Kind: workflow.NodeKindExpr,
		Metadata: map[string]any{
			// "expr": "map(fromJSON(input), {.related})",
			"expr": `map(get(fromJSON(input),"relatedSearches"), {.query})`,
		},
		Inputs: workflow.Parameters{
			"urls": workflow.Parameter{
				Name:  "input",
				Value: "{{search.result}}",
			},
		},
	}
	exprNode3 = workflow.Node{
		ID:   "expr3",
		Name: "expr3",
		Kind: workflow.NodeKindExpr,
		Metadata: map[string]any{
			// "expr": "map(fromJSON(input), {.related})",
			"expr": `get(fromJSON(input),"organic")`,
		},
		Inputs: workflow.Parameters{
			"urls": workflow.Parameter{
				Name:  "input",
				Value: "{{search.result}}",
			},
		},
	}
	spiderNode = workflow.Node{
		ID:   "spider",
		Name: "spider",
		Kind: workflow.NodeKindTool,
		Metadata: map[string]any{
			"provider_kind": "code",
			"tool_name":     "spider",
		},
		Inputs: workflow.Parameters{
			"urls": workflow.Parameter{
				Name:  "urls",
				Value: "{{expr.resultx}}",
			},
		},
		Outputs: workflow.Parameters{
			"result": workflow.Parameter{
				Name: "result",
				Type: "json",
			},
		},
	}
	endNode = workflow.Node{
		ID:   "end",
		Name: "end",
		Kind: workflow.NodeKindEnd,
		Outputs: workflow.Parameters{
			"sources": workflow.Parameter{
				Name:  "sources",
				Value: "{{expr3.result}}",
				Type:  "json",
			},
			"details": workflow.Parameter{
				Name:  "details",
				Value: "{{spider.result}}",
				Type:  "json",
			},
			"related": workflow.Parameter{
				Name:  "related",
				Value: "{{expr2.result}}",
				Type:  "json",
			},
		},
	}
)

var (
	startNode2 = workflow.Node{
		ID:   "start_1",
		Name: "start",
		Kind: workflow.NodeKindStart,
		Inputs: workflow.Parameters{
			"query": workflow.Parameter{
				Name:  "query",
				Value: "{{query}}",
			},
		},
	}
	searchNode2 = workflow.Node{
		ID:   "search",
		Name: "search",
		Kind: workflow.NodeKindTool,
		Metadata: map[string]any{
			"provider_id":   7,
			"provider_kind": "code",
			"tool_name":     "ai_search",
			"stream":        true,
		},
		Inputs: workflow.Parameters{
			"query": workflow.Parameter{
				Name:  "query",
				Value: "{{query}}",
			},
		},
		Outputs: workflow.Parameters{},
	}
	endNode2 = workflow.Node{
		ID:   "end",
		Name: "end",
		Kind: workflow.NodeKindEnd,
		Outputs: workflow.Parameters{
			"result": workflow.Parameter{
				Name:  "result",
				Value: "{{search.result}}",
				Type:  "channel",
			},
		},
	}
)

// NewWorkflow ...
func NewWorkflow() *workflow.Workflow {
	mywf := workflow.NewWorkflow(123, "test").Link(
		startNode2,
		searchNode2,
		endNode2,
	)
	return mywf
}

func NewWorkflow2() *workflow.Workflow {
	mywf := workflow.NewWorkflow(123, "test").Link(
		startNode,
		searchNode,
		exprNode,
		exprNode2,
		exprNode3,
		spiderNode,
		endNode,
	)
	return mywf
}
