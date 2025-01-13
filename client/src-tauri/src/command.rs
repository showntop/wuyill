mod llm;
mod search;
mod calculator;

use tauri::AppHandle;
use tauri::Url;
use tauri_nspanel::ManagerExt;

use std::{process::Command, time::Instant};
use calculator::calculate;

pub use search::{search, similarity_sort};
pub use llm::handle_stream_chat;

pub const SPOTLIGHT_LABEL: &str = "main";

#[tauri::command]
pub fn show(app_handle: AppHandle) {
    let panel = app_handle.get_webview_panel(SPOTLIGHT_LABEL).unwrap();

    panel.show();
}

#[tauri::command]
pub fn hide(app_handle: AppHandle) {
    let panel = app_handle.get_webview_panel(SPOTLIGHT_LABEL).unwrap();

    if panel.is_visible() {
        panel.order_out(None);
    }
}

#[tauri::command]
pub fn open_command(path: &str) {
    println!("path: {:?}", path);
    Command::new("open")
        .arg(path.trim())
        .spawn()
        .expect("failed to execute process");
}

#[tauri::command]
pub fn open_window(app: tauri::AppHandle){
    // let webview_window = 
    let url = Url::parse("http://www.wuyill.com").expect("url parse error");

    tauri::WebviewWindowBuilder::new(
            &app, "xfa", 
            tauri::WebviewUrl::External(url),
        )
        .inner_size(800.0, 600.0)
        .title("chat")
        .build()
        .unwrap();
    // webview_window.SWE
}

#[tauri::command]
pub async fn chat_bot(message: String, app_handle: AppHandle) -> Result<(), String> {
    return handle_stream_chat(message, app_handle)
        .await
        .map_err(|e| e.to_string())
}

#[derive(Clone)]
pub enum ResultType {
    Applications = 1,
    Files = 2,
    Calculation = 3,
    AISearch = 4,
}

#[tauri::command]
pub async fn handle_input(input: String) -> (Vec<String>, f32, i32) {
    println!("input: {:?}", input);
    let mut result: Vec<String>;
    let mut result_type: ResultType;
    let start_time = Instant::now();
    // 正则匹配，如果为计算，则返回计算结果
    let calculation_result = calculate(input.as_str());
    if calculation_result != "" {
        result = Vec::new();
        result.push(calculation_result);
        result_type = ResultType::Calculation;
        let time_taken = start_time.elapsed().as_secs_f32();
        return (result, time_taken, result_type as i32);
    }

    if !input.starts_with("/") {
        result = search(
            input.as_str(),
            vec![
                "~/Applications",
                "/Applications",
                "/System/Applications",
                "/System/Applications/Utilities",
            ],
            Some(".app"),
            Some(1),
        );
        similarity_sort(&mut result, input.as_str());
        result_type = ResultType::Applications;
    } else {
        result = search(
            input.trim_start_matches("/"),
            vec!["/Users/"],
            None,
            Some(10000),
        );
        println!("{:?}", result);
        result_type = ResultType::Files;
    }
    if result.len() == 0 {
        // ai search
        result_type = ResultType::AISearch;
    }
    let time_taken = start_time.elapsed().as_secs_f32();
    println!("time_taken: {}, result: {:?}, result_type: {:#?}", time_taken, result, (result_type.clone() as i32));
    return (result, time_taken, result_type as i32);
}