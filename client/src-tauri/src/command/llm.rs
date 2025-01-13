use serde_json::json;
use futures_util::StreamExt;
use tauri::Emitter;
use reqwest;

pub async fn handle_stream_chat(message: String, app_handle: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // 这里替换为实际的大模型 API 调用
    let client = reqwest::Client::new();
    let mut stream = client
        .post("http://wuyill.com/api/search")
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
        // let chunk = chunk?;
        // let chunk_vec = chunk.to_vec();
        // let data = String::from_utf8_lossy(&chunk_vec);
        let chunk_str = String::from_utf8_lossy(&chunk?.to_vec()).to_string();
        println!("chunk: {}", chunk_str);
        //  解析event      分割 \n 
        let parts = chunk_str.split("\n").collect::<Vec<&str>>();
        let data = parts[1].to_string();
        // 去除 data: 前缀
        let data = data.trim_start_matches("data:").to_string();
        println!("data: {}", data);
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

