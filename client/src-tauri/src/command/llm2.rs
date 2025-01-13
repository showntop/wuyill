use serde_json::json;
use futures_util::StreamExt;
use tauri::Emitter;
use reqwest;

pub async fn handle_stream_chat2(message: String, app_handle: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // 这里替换为实际的大模型 API 调用
    let client = reqwest::Client::new();
    let mut stream = client
        .post("http://127.0.0.1:9001/api/search")
        .json(&serde_json::json!({
            "model": "gpt-4o",
            // "temperature": 0.0,
            // "max_tokens": 100,
            // "top_p": 1.0,
            // "frequency_penalty": 0.0,
            // "presence_penalty": 0.0,
            // "stop": ["\n"],
            // "logprobs": 1,
            "messages": [{
                "role": "user",
                "content": message
            }],
            "stream": true
        }))
        .send()
        .await?
        .bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;
        let chunk_vec = chunk.to_vec();
        let data = String::from_utf8_lossy(&chunk_vec);
        println!("raw data: {}", data);
        if data.trim().is_empty() {
            continue;
        }
        // 跳过空行
        // if data.trim().is_empty() {
        //     continue;
        // }
        // 去除 "data: " 前缀，如果存在的话
        // if !data.starts_with("data: ") {
        //     continue;
        // }
        
        if data == "data: [DONE]" { 
            continue;
        }
        
        // let xdata: String = data.trim_start_matches("data: ").into();
        // let json_data: serde_json::Value = serde_json::from_str(&xdata)?;
        // let content = json_data["choices"][0]["delta"]["content"].as_str().unwrap_or("");
        // let content = data;
        // 发送流式内容到前端
        let json_data = json!({
            "data": data,
            "done": false,
            "error": null
        });
        println!("{}", json_data);
        app_handle.emit("chat_stream", json_data)?;
    }
   
    // 发送完成信号
    app_handle.emit("chat_stream", json!({
        "data": "",
        "done": true,
        "error": null
    }))?;

    Ok(())
}  

