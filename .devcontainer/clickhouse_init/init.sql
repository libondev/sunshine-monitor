-- 监控事件主表
CREATE TABLE IF NOT EXISTS monitor_events (
    -- 基础标识
    app_id String,                                          -- 应用 ID (DSN)
    event_id UUID DEFAULT generateUUIDv4(),                 -- 事件唯一 ID

-- Envelope 信息
event_type LowCardinality (String), -- 'message' | 'event'
timestamp DateTime64 (3, 'Asia/Shanghai'), -- 客户端时间戳
sdk_version String DEFAULT '', -- SDK 版本

-- 数据内容
payload JSON DEFAULT '{}', -- 实际数据

-- 浏览器环境信息（JSON 格式，包含完整的浏览器、设备、页面、网络等上下文）
browser_info JSON DEFAULT '{}',

-- 服务端信息


server_time DateTime64(3, 'Asia/Shanghai') DEFAULT now64(3, 'Asia/Shanghai'),
    client_ip String DEFAULT ''
    
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(server_time)
ORDER BY (app_id, event_type, server_time)
TTL server_time + INTERVAL 90 DAY;