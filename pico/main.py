import network
import time
import urequests
from machine import ADC, Pin

# WIFI
WIFI_SSID = "FOXTECH"
WIFI_PASSWORD = "Foxtechajalad"

SERVER_IP_URL = "http://192.168.1.41:8000/"

# PINS
mq2 = ADC(27)

relay1 = Pin(2, Pin.OUT)   # Motor OPEN
relay2 = Pin(3, Pin.OUT)   # Motor CLOSE
relay3 = Pin(4, Pin.OUT)   # Light
relay4 = Pin(5, Pin.OUT)   # Exhaust

wifi_status = False

# WIFI
def connect_wifi():
    global wifi_status

    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
        wifi_status = True
        print("WiFi connected:", wlan.ifconfig()[0])
        return

    if not wlan.isconnected():

        print("Connecting to WiFi...")
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)

        timeout = 5
        while timeout > 0 and not wlan.isconnected():
            print("Waiting for connection...")
            time.sleep(1)
            timeout -= 1

    wifi_status = wlan.isconnected()

    if wifi_status:
        print("WiFi connected:", wlan.ifconfig()[0])
    else:
        print("WiFi failed")

# SENSOR
def sensor_data():
    return mq2.read_u16()

# SEND
def send_data(data):

    payload = {
        "sensor": data
    }

    url = SERVER_IP_URL + "api/get-sensor/"

    r = None

    try:
        r = urequests.post(url, json=payload)
        print("Server response:", r.text)

    except Exception as e:
        print("Send error:", e)

    finally:
        if r is not None:
            r.close()

# GET
def get_data():

    url = SERVER_IP_URL + "api/send-relay/"
    
    try:
        r = urequests.get(url)
        
        print("RAW RESPONSE:", r.text)  
        data = r.json()
        r.close()
        
        #print(data)
        return data

    except Exception as e:
        print("Get error:", e)
        return None

# RELAY CONTROL (ACTIVE LOW)
def light_on():
    relay3.value(1)
    
def light_off():
    relay3.value(0)

def exhaust_on():
    relay4.value(1)
    
def exhaust_off():
    relay4.value(0)

def motor_stop():
    print("Motor stop")
    relay1.value(0)
    relay2.value(0)

def motor_open():
    relay1.value(1)
    relay2.value(0)
    time.sleep(1)

def motor_close():
    relay1.value(0)
    relay2.value(1)
    time.sleep(1)

# MAIN
def main():

    motor_stop()
    while True:
        try:
            connect_wifi()

            val = sensor_data()
            send_data(val)

            data = get_data()
            if not data:
                time.sleep(2)
                continue

            print(data)

            is_light = data.get("is_light", False)
            is_exhaust = data.get("is_exhaust", False)
            is_open = data.get("is_garage_open", False)
            is_close = data.get("is_garage_close", False)

            # ---------- OPEN ----------
            if is_open:
                print("OPEN")

                light_on()
                motor_open()

            # ---------- CLOSE ----------
            elif is_close:
                print("CLOSE")

                motor_close()
                light_off()

            # ---------- NORMAL ----------
            else:
                motor_stop()
                if is_exhaust:
                    exhaust_on()
                    light_on()
                else:
                    exhaust_off()

                if is_light:
                    light_on()
                else:
                    light_off()

        except Exception as e:
            print("Error:", e)

        time.sleep(1)

main()
