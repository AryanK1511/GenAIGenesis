import RPi.GPIO as GPIO
import time

# Setup GPIO mode
GPIO.setmode(GPIO.BCM)

# Define the GPIO pin connected to the servo
LICKER_PIN = 18
FLIPPER_PIN = 17

# Setup the servo pin as output
GPIO.setup(LICKER_PIN, GPIO.OUT)
GPIO.setup(FLIPPER_PIN, GPIO.OUT)

# Create a PWM instance on the servo pin with a frequency of 50Hz
licker_pwm = GPIO.PWM(LICKER_PIN, 50)
flipper_pwm = GPIO.PWM(FLIPPER_PIN, 50)

def flip_licker():
    try:
        # Start PWM with a duty cycle of 0 (servo in neutral position)
        licker_pwm.start(0)
        
        # Move licker by 1 rotation
        licker_pwm.ChangeDutyCycle(8.5)
        time.sleep(1) # Wait for the servo to move 1 rotation

        # Stop PWM
        licker_pwm.ChangeDutyCycle(0)
    finally:
        # Cleanup GPIO resources
        licker_pwm.stop()
        GPIO.cleanup()

def flip_flipper():
    try:
        # Start PWM with a duty cycle of 0 (servo in neutral position)
        flipper_pwm.start(0)
        
        # Move flipper to 90 degrees (adjust duty cycle as needed for your servo)
        flipper_pwm.ChangeDutyCycle(8.5)
        time.sleep(1)  # Wait for the servo to move 90 degrees
        
        # Move flipper back to 0 degrees
        flipper_pwm.ChangeDutyCycle(6.5)
        time.sleep(1)  # Wait for the servo to move
        
        # Stop PWM
        flipper_pwm.ChangeDutyCycle(0)
    finally:
        # Cleanup GPIO resources
        flipper_pwm.stop()
        GPIO.cleanup()

async def flip():
    try:
        flip_licker()
        flip_flipper()
    except e:
        print(f"\033[91m[ERROR]\033[0m An exception occurred during flipping: {e}")

# Example usage
if __name__ == "__main__":
    flip()