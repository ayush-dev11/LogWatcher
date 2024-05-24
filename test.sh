#!/bin/bash

######################################################
###### Usage #########################################
###### bash generate_dummy_logs.sh /tmp/test_logs#####
######################################################
# Check if a filename is provided


if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# File to write logs to
LOG_FILE="$1"

# Array of severities
SEVERITIES=("ERROR" "WARNING" "CRITICAL" "INFO")

# Array of tech terms
TECH_TERMS=("API" "Database" "Endpoint" "Memory" "Server" "CPU" "Request" "Response" "Session" "Connection")

# Function to generate a random log message
generate_log_message() {
    local severity_index=$((RANDOM % ${#SEVERITIES[@]}))
    local term_index=$((RANDOM % ${#TECH_TERMS[@]}))

    local severity=${SEVERITIES[$severity_index]}
    local term=${TECH_TERMS[$term_index]}
    
    case $severity in
        ERROR)
            messages=("The $term encountered an issue." "$term failed to respond." "A $term timeout occurred.")
            ;;
        WARNING)
            messages=("Unexpected $term behavior detected." "Potential issue with $term detected." "$term nearing capacity.")
            ;;
        CRITICAL)
            messages=("$term is down!" "$term returned an invalid result." "Critical fault in $term.")
            ;;
        INFO)
            messages=("$term is operating normally." "$term initialization complete." "User accessed $term." "$term executed successfully.")
            ;;
    esac

    local message_index=$((RANDOM % ${#messages[@]}))
    echo "$severity - ${messages[$message_index]}"
}

# Main loop to generate and write log messages
while true; do
    current_time=$(date '+%Y-%m-%d %H:%M:%S')
    log_message=$(generate_log_message)
    echo "$current_time - $log_message" >> "$LOG_FILE"
    sleep $((1 + RANDOM % 3))
done