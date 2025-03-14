# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder
2. "When running the emulator, the client will occasionally recieve values in the incorrect format"

- Data is ocasionally being parsed wrong to the FE
- Approach 1: Parse only integers to FE
    - Change battery_temperature type to number, remove string.
    - try/catch block to push data into FE.

3. "A safe operating range for the battery temperature is 20-80 degrees. Add a feature to the backend streaming-service so that each time the received battery temperature exceeds this range more than 3 times in 5 seconds, the current timestamp and a simple error message is printed to console."

pseudo:
- Create glob variables for guards
- Guard for min and max temp
- Append timestamp to violations array
- Check len of violations array, if >= 3, return error.

"Currently the connect/disconnect button in the top right corner of the ui (frontend) does not update when data is streamed in via streaming service. Why is this occurring and what can be done to rectify this?"

- Badge at top right is not changing upon connection status changes.
- Issue: useEffect is not managed correctly. readyState is only set once, not dynamically (depenmdency arr is empty after useEffect). 
- Resolution: Add readyState dependency in useEffect

4. 
"The NextJS frontend is currently very basic. Using primarily tailwindCSS and Shadcn/ui components, extend the frontend by completing the following: 
Ensure the data displayed from streaming-service is correct to 3 decimal places instead of being unbounded as it is currently."

- Convert current temp values in ui to 3 sig figs.
- Added Number(lastJsonMessage.battery_temperature).toFixed(3) in useEffect for page.tsx

"Ensure the battery temperature value changes colours based on the current temperature (E.g. changing to red when the safe temperature range is exceeded)."

- Was not able to do this at the time. 

3. added features:
- Live Graph:
    Live graph that displays the latest battery temperature data points. The graph slides along with the values, showing only the most recent data points and creating a dynamic, real-time visualization

- Percent change display:
    Added a component to display the most recent percentage change in battery temperature. This helps users quickly see how much the temperature has increased or decreased compared to the previous value

- Threshold to Line graph:
    added a horizontal dotted line to the graph to indicate a threshold value. This helps users quickly identify when the battery temperature exceeds a critical level. Also made data points red on graph if threshold was ever exceeded.


## Cloud