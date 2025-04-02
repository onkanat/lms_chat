// Calculator Agent
// Performs engineering calculations using math.js

const CalculatorAgent = {
    // Execute a calculation request
    async execute(toolName, params) {
        console.log(`Executing calculation: ${JSON.stringify(params)}`);
        
        // Validate parameters
        if (!params.expression) {
            return 'Error: Missing required parameter "expression"';
        }
        
        // Get precision (default to 4)
        const precision = parseInt(params.precision || '4');
        
        try {
            // Perform the calculation
            const result = this.calculateExpression(params.expression, precision);
            
            // Format the result
            return this.formatCalculationResult(params.expression, result, precision);
        } catch (error) {
            console.error('Calculation error:', error);
            return `Error calculating expression: ${error.message}`;
        }
    },
    
    // Calculate an expression
    calculateExpression(expression, precision) {
        try {
            // In a real implementation, this would use math.js or a similar library
            // For demonstration, we'll use a simplified approach
            return this.simulateCalculation(expression, precision);
        } catch (error) {
            throw new Error(`Failed to calculate expression: ${error.message}`);
        }
    },
    
    // Simulate calculation (for demonstration)
    simulateCalculation(expression, precision) {
        // Clean up the expression
        expression = expression.trim();
        
        // Handle some common engineering calculations
        
        // Convert degrees to radians for trigonometric functions
        expression = expression.replace(/sin\s*\(\s*([0-9.]+)\s*deg\s*\)/gi, (match, angle) => {
            return `sin(${parseFloat(angle) * Math.PI / 180})`;
        });
        
        expression = expression.replace(/cos\s*\(\s*([0-9.]+)\s*deg\s*\)/gi, (match, angle) => {
            return `cos(${parseFloat(angle) * Math.PI / 180})`;
        });
        
        expression = expression.replace(/tan\s*\(\s*([0-9.]+)\s*deg\s*\)/gi, (match, angle) => {
            return `tan(${parseFloat(angle) * Math.PI / 180})`;
        });
        
        // Handle sqrt function
        expression = expression.replace(/sqrt\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.sqrt(${value})`;
        });
        
        // Handle sin, cos, tan functions
        expression = expression.replace(/sin\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.sin(${value})`;
        });
        
        expression = expression.replace(/cos\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.cos(${value})`;
        });
        
        expression = expression.replace(/tan\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.tan(${value})`;
        });
        
        // Handle log functions
        expression = expression.replace(/log10\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.log10(${value})`;
        });
        
        expression = expression.replace(/log\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.log(${value})`;
        });
        
        // Handle exponential
        expression = expression.replace(/exp\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.exp(${value})`;
        });
        
        // Handle power
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, (match, base, exponent) => {
            return `Math.pow(${base}, ${exponent})`;
        });
        
        // Handle constants
        expression = expression.replace(/pi/gi, 'Math.PI');
        expression = expression.replace(/e(?![a-zA-Z])/g, 'Math.E');
        
        // Handle absolute value
        expression = expression.replace(/abs\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.abs(${value})`;
        });
        
        // Handle floor and ceiling
        expression = expression.replace(/floor\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.floor(${value})`;
        });
        
        expression = expression.replace(/ceil\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.ceil(${value})`;
        });
        
        // Handle round
        expression = expression.replace(/round\s*\(\s*([^)]+)\s*\)/gi, (match, value) => {
            return `Math.round(${value})`;
        });
        
        // Handle max and min
        expression = expression.replace(/max\s*\(\s*([^)]+)\s*\)/gi, (match, values) => {
            return `Math.max(${values})`;
        });
        
        expression = expression.replace(/min\s*\(\s*([^)]+)\s*\)/gi, (match, values) => {
            return `Math.min(${values})`;
        });
        
        // Handle unit conversions
        // Temperature: Celsius to Fahrenheit
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*C\s*to\s*F/gi, (match, celsius) => {
            return `(${celsius} * 9/5 + 32)`;
        });
        
        // Temperature: Fahrenheit to Celsius
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*F\s*to\s*C/gi, (match, fahrenheit) => {
            return `((${fahrenheit} - 32) * 5/9)`;
        });
        
        // Length: meters to feet
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*m\s*to\s*ft/gi, (match, meters) => {
            return `(${meters} * 3.28084)`;
        });
        
        // Length: feet to meters
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*ft\s*to\s*m/gi, (match, feet) => {
            return `(${feet} * 0.3048)`;
        });
        
        // Weight: kg to lb
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*kg\s*to\s*lb/gi, (match, kg) => {
            return `(${kg} * 2.20462)`;
        });
        
        // Weight: lb to kg
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*lb\s*to\s*kg/gi, (match, lb) => {
            return `(${lb} * 0.453592)`;
        });
        
        // Evaluate the expression
        try {
            // Use Function constructor to evaluate the expression
            // Note: In a production environment, you would use a proper math library
            // with appropriate security measures
            const result = new Function(`return ${expression}`)();
            
            // Round to the specified precision
            return parseFloat(result.toFixed(precision));
        } catch (error) {
            throw new Error(`Invalid expression: ${expression}`);
        }
    },
    
    // Format calculation result for display
    formatCalculationResult(expression, result, precision) {
        let formattedResult = `### Calculation Result\n\n`;
        formattedResult += `**Expression:** \`${expression}\`\n\n`;
        formattedResult += `**Result:** \`${result}\`\n\n`;
        
        // Add some additional information for certain types of calculations
        if (expression.includes('deg')) {
            formattedResult += `*Note: Degree values were converted to radians for calculation.*\n\n`;
        }
        
        if (expression.includes('to')) {
            formattedResult += `*Note: Unit conversion was performed.*\n\n`;
        }
        
        return formattedResult;
    }
};

// Export the Calculator Agent
window.CalculatorAgent = CalculatorAgent;