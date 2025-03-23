import pigpio
import time

# Set the GPIO pin for the servosudo
FLIPPER_PIN = 17
LICKER_PIN = 27



# Set the PWM frequency (e.g., 50 Hz)
PWM_FREQUENCY = 50

# Set the pulse width for 0 degrees (e.g., 500 microseconds)
MIN_PULSE = 500

# Set the pulse width for 180 degrees (e.g., 2500 microseconds)
MAX_PULSE = 2500

# Set the servo to a specific angle
def set_licker_angle(angle, pi):
    # Calculate the pulse width for the given angle
    pulse_width = (angle - 0) / 180 * (MAX_PULSE - MIN_PULSE) + MIN_PULSE

    # Set the PWM duty cycle
    pi.set_servo_pulsewidth(LICKER_PIN, pulse_width)

def set_flipper_angle(angle, pi):
    # Calculate the pulse width for the given angle
    pulse_width = (angle - 0) / 180 * (MAX_PULSE - MIN_PULSE) + MIN_PULSE

    # Set the PWM duty cycle
    pi.set_servo_pulsewidth(FLIPPER_PIN, pulse_width)

# Main loop
def flip():
    # Create a pigpio instance
    pi = pigpio.pi()
    print("Flipper and Licker are ready")
    try:
        set_flipper_angle(0, pi)
        time.sleep(0.5) # Wait for the flipper to reach 0 degrees

        set_licker_angle(100, pi)
        time.sleep(1.15) # Wait for the licker to get the page up
        set_licker_angle(90, pi) # Stop moving it
        
        set_flipper_angle(100, pi)
        time.sleep(2) # Wait for the flipper to flip the page

        set_licker_angle(0, pi)
        time.sleep(0.5) # Wait for the licker to get the pages back to the original position

    except KeyboardInterrupt:
        pass

    finally:
        # Stop the PWM signal
        pi.set_servo_pulsewidth(LICKER_PIN, 0)
        pi.set_servo_pulsewidth(FLIPPER_PIN, 0)
        pi.stop()


if __name__ == "__main__":
    flip()
    