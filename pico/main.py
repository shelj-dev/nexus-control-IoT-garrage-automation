import network
import time
import urequests
from machine import ADC

WIFI_SSID = "iot kids"
WIFI_PASSWORD = "bright kidoos"

SERVER_IP_URL = "http://10.189.178.236:8000/"

wifi_status = False

# MQ2 sensor on ADC pin
mq2 = ADC(28)
relay1 = Pin(16, Pin.OUT)
relay2= Pin(17, Pin.OUT)
relay3 = Pin(18, Pin.OUT)
relay4= Pin(19, Pin.OUT)

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


def main():
    while True:

        connect_wifi()

        sensor = sensor_data()

        if wifi_status:
            send_data(sensor)

            get_data(sensor)

        time.sleep(1)


main()
