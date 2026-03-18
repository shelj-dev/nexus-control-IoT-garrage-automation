import network
import time
import urequests
from machine import ADC, Pin

WIFI_SSID = "iot kids"
WIFI_PASSWORD = "bright kidoos"

SERVER_IP_URL = "http://10.189.178.101:8000/"

wifi_status = False

# MQ2 sensor on ADC pin
mq2 = ADC(27)
relay1 = Pin(2, Pin.OUT)
relay2= Pin(3, Pin.OUT)
relay3 = Pin(4, Pin.OUT)
relay4= Pin(5, Pin.OUT)

def connect_wifi():
    global wifi_status

    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
        wifi_status = True
        print("WiFi connected:", wlan.ifconfig()[0])
        return

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
       

def sensor_data():
    value = mq2.read_u16()
    voltage = value * 3.3 / 65535

    print("Raw:", value, "Voltage:", round(voltage, 2))

    return value

def light_on():
    relay3.value(1)
    
def light_off():
    relay3.value(0)


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


def get_data():

    url = SERVER_IP_URL + "api/send-relay/"
    
    try:
        r = urequests.get(url)
        data = r.json()
        r.close()

        print(data)
        return data

    except Exception as e:
        print("Get error:", e)


def motor_on():
    relay2.value(0)
    relay1.value(1)
    
def motor_off():
    relay2.value(1)
    relay1.value(0)
    
def light_on():
    relay3.value(1)
    
def light_off():
    relay3.value(0)

def exhaust_on():
    relay4.value(1)

def exhaust_off():
    relay4.value(0)


def garage_open(delay):
    relay1.value(1)
    relay2.value(0)
    time.sleep(delay)

    
def garage_close(delay):
    relay1.value(0)
    relay2.value(1)
    time.sleep(delay)


def main():
    while True:

        connect_wifi()
        sensor = sensor_data()

        if wifi_status:
            send_data(sensor)

            data = get_data()

            is_garage = data.get("is_garage")            
            garage_delay = data.get("garage_delay")            
            is_light = data.get("is_light")            
            is_exhaust = data.get("is_exhaust")
            is_garage_open = data.get("is_garage_open")
            is_garage_close = data.get("is_garage_close")

            if is_light:
                light_on()
            else:
                light_off()
                
            if is_exhaust:
                exhaust_on()
            else:
                exhaust_off()

            if is_garage_open:
                garage_open(garage_delay)
            
            if is_garage_close:
                garage_close(garage_delay)


        time.sleep(1)


main()
