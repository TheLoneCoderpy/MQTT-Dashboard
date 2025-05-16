import time
import json
import paho.mqtt.client as mqtt
import math

# MQTT-Broker-Konfiguration
BROKER = "192.168.178.43"  # Öffentlicher Broker
PORT = 1883
TOPIC = "test/topic"

def main():
    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    try:
        counter = 0 
        while True:
            payload = {
                "timestamp": time.time(),
                "value": math.sin(counter) * 50 + 50
            }
            message = json.dumps(payload)
            result = client.publish(TOPIC, message)
            status = result[0]
            if status == 0:
                print(f"Gesendet: {message}")
            else:
                print(f"Fehler beim Senden an Topic {TOPIC}")
            counter += 0.5
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()