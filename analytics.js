// Performance Analytics Module (Non-AI)
class PerformanceAnalytics {
    constructor() {
        // No API keys needed
    }

    // Collect detailed session metrics
    collectSessionMetrics(sessionId) {
        const metricsHTML = `
            <div class="metrics-collection-modal" id="metricsModal-${sessionId}">
                <div class="metrics-content">
                    <h3 style="color: #8fa8c0; margin-bottom: 25px; font-weight: 300;">Session Performance Metrics</h3>
                    
                    <div class="metrics-grid">
                        <div class="metric-input-group">
                            <label>Task Complexity (1-10)</label>
                            <input type="range" id="complexity-${sessionId}" min="1" max="10" value="5">
                            <span class="range-value">5</span>
                        </div>
                        
                        <div class="metric-input-group">
                            <label>Focus Level (1-10)</label>
                            <input type="range" id="focus-${sessionId}" min="1" max="10" value="5">
                            <span class="range-value">5</span>
                        </div>
                        
                        <div class="metric-input-group">
                            <label>Interruptions Count</label>
                            <input type="number" id="interruptions-${sessionId}" min="0" value="0">
                        </div>
                        
                        <div class="metric-input-group">
                            <label>Tasks Completed</label>
                            <input type="number" id="tasksCompleted-${sessionId}" min="0" value="1">
                        </div>
                        
                        <div class="metric-input-group">
                            <label>Energy Level (Start)</label>
                            <select id="energyStart-${sessionId}">
                                <option value="high">High</option>
                                <option value="medium" selected>Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        
                        <div class="metric-input-group">
                            <label>Energy Level (End)</label>
                            <select id="energyEnd-${sessionId}">
                                <option value="high">High</option>
                                <option value="medium" selected>Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        
                        <div class="metric-input-group" style="grid-column: span 2;">
                            <label>Task Category</label>
                            <select id="category-${sessionId}">
                                <option value="development">Development</option>
                                <option value="planning">Planning</option>
                                <option value="meeting">Meeting</option>
                                <option value="research">Research</option>
                                <option value="documentation">Documentation</option>
                                <option value="testing">Testing</option>
                                <option value="deployment">Deployment</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="metric-input-group" style="grid-column: span 2;">
                            <label>Objectives Achieved</label>
                            <textarea id="objectives-${sessionId}" placeholder="List the objectives achieved during this session..."></textarea>
                        </div>
                        
                        <div class="metric-input-group" style="grid-column: span 2;">
                            <label>Challenges Faced</label>
                            <textarea id="challenges-${sessionId}" placeholder="Describe any challenges or blockers..."></textarea>
                        </div>
                    </div>
                    
                    <div class="button-group" style="margin-top: 30px;">
                        <button onclick="analytics.saveMetrics(${sessionId})" class="primary">Analyze Performance</button>
                        <button onclick="analytics.closeMetricsModal(${sessionId})">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = metricsHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Add event listeners for range inputs
        const modal = document.getElementById(`metricsModal-${sessionId}`);
        modal.querySelectorAll('input[type="range"]').forEach(input => {
            const valueSpan = input.nextElementSibling;
            input.addEventListener('input', () => {
                valueSpan.textContent = input.value;
            });
        });
    }

    async saveMetrics(sessionId) {
        const metrics = {
            complexity: document.getElementById(`complexity-${sessionId}`).value,
            focus: document.getElementById(`focus-${sessionId}`).value,
            interruptions: document.getElementById(`interruptions-${sessionId}`).value,
            tasksCompleted: document.getElementById(`tasksCompleted-${sessionId}`).value,
            energyStart: document.getElementById(`energyStart-${sessionId}`).value,
            energyEnd: document.getElementById(`energyEnd-${sessionId}`).value,
            category: document.getElementById(`category-${sessionId}`).value,
            objectives: document.getElementById(`objectives-${sessionId}`).value,
            challenges: document.getElementById(`challenges-${sessionId}`).value
        };
        
        // Save metrics to session
        const session = app.sessions.find(s => s.id === sessionId);
        if (session) {
            session.metrics = metrics;
            
            // Calculate performance scores (no AI needed)
            session.performanceScores = this.calculatePerformanceScores(session);
            
            app.saveData();
            app.renderSessions();
            this.closeMetricsModal(sessionId);
            
            // Refresh modal if open
            if (document.getElementById('sessionModal')?.classList.contains('active')) {
                app.openSessionModal(sessionId);
            }
        }
    }

    closeMetricsModal(sessionId) {
        const modal = document.getElementById(`metricsModal-${sessionId}`);
        if (modal) {
            modal.remove();
        }
    }

    calculatePerformanceScores(session) {
        const metrics = session.metrics || {};
        const duration = session.duration;
        
        // Efficiency Score: Based on tasks completed, complexity, and time
        const tasksPerHour = (metrics.tasksCompleted || 1) / (duration / 3600000);
        const complexityFactor = (metrics.complexity || 5) / 10;
        const efficiencyScore = Math.min(100, Math.round(tasksPerHour * 20 * (1 + complexityFactor)));
        
        // Focus Score: Based on focus level and interruptions
        const focusBase = (metrics.focus || 5) * 10;
        const interruptionPenalty = Math.min(30, (metrics.interruptions || 0) * 5);
        const focusScore = Math.max(0, focusBase - interruptionPenalty);
        
        // Stamina Score: Based on energy levels and duration
        const energyMap = { high: 3, medium: 2, low: 1 };
        const startEnergy = energyMap[metrics.energyStart || 'medium'];
        const endEnergy = energyMap[metrics.energyEnd || 'medium'];
        const energyRetention = (endEnergy / startEnergy) * 100;
        const durationBonus = Math.min(20, (duration / 3600000) * 5);
        const staminaScore = Math.min(100, Math.round((energyRetention * 0.7) + durationBonus));
        
        // Overall Performance Score
        const overallScore = Math.round((efficiencyScore * 0.4) + (focusScore * 0.35) + (staminaScore * 0.25));
        
        return {
            efficiency: efficiencyScore,
            focus: focusScore,
            stamina: staminaScore,
            overall: overallScore,
            grade: this.getPerformanceGrade(overallScore)
        };
    }

    getPerformanceGrade(score) {
        if (score >= 90) return 'S';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }


    renderPerformanceCharts(sessionId) {
        const session = app.sessions.find(s => s.id === sessionId);
        if (!session || !session.performanceScores) return '';

        const scores = session.performanceScores;
        
        return `
            <div class="performance-charts">
                <div class="chart-container">
                    <canvas id="radarChart-${sessionId}" width="300" height="300"></canvas>
                </div>
                <div class="performance-grade">
                    <div class="grade-display ${scores.grade.toLowerCase()}-grade">
                        ${scores.grade}
                    </div>
                    <div class="grade-label">Performance Grade</div>
                </div>
                <div class="score-bars">
                    <div class="score-bar">
                        <div class="score-label">Efficiency</div>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${scores.efficiency}%; background: linear-gradient(90deg, #4682b4, #5a92c4);"></div>
                        </div>
                        <div class="score-value">${scores.efficiency}%</div>
                    </div>
                    <div class="score-bar">
                        <div class="score-label">Focus</div>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${scores.focus}%; background: linear-gradient(90deg, #4682b4, #5a92c4);"></div>
                        </div>
                        <div class="score-value">${scores.focus}%</div>
                    </div>
                    <div class="score-bar">
                        <div class="score-label">Stamina</div>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${scores.stamina}%; background: linear-gradient(90deg, #4682b4, #5a92c4);"></div>
                        </div>
                        <div class="score-value">${scores.stamina}%</div>
                    </div>
                    <div class="score-bar">
                        <div class="score-label">Overall</div>
                        <div class="score-track">
                            <div class="score-fill" style="width: ${scores.overall}%; background: linear-gradient(90deg, #4682b4, #6aa2d4);"></div>
                        </div>
                        <div class="score-value">${scores.overall}%</div>
                    </div>
                </div>
            </div>
        `;
    }

    drawRadarChart(sessionId) {
        const canvas = document.getElementById(`radar-chart-${sessionId}`);
        if (!canvas) {
            console.error('Canvas not found for session:', sessionId);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const session = app.sessions.find(s => s.id === sessionId);
        if (!session || !session.performanceScores) return;
        
        const scores = session.performanceScores;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(70, 130, 180, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            const r = (radius / 5) * i;
            for (let j = 0; j < 3; j++) {
                const angle = (Math.PI * 2 / 3) * j - Math.PI / 2;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw axes
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }
        
        // Draw data
        ctx.fillStyle = 'rgba(70, 130, 180, 0.3)';
        ctx.strokeStyle = 'rgba(70, 130, 180, 0.8)';
        ctx.lineWidth = 2;
        
        const values = [scores.efficiency, scores.focus, scores.stamina];
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
            const value = values[i] / 100;
            const x = centerX + Math.cos(angle) * radius * value;
            const y = centerY + Math.sin(angle) * radius * value;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#8fa8c0';
        ctx.font = '12px "DM Sans", sans-serif';
        ctx.textAlign = 'center';
        
        const labels = ['EFFICIENCY', 'FOCUS', 'STAMINA'];
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius + 20);
            const y = centerY + Math.sin(angle) * (radius + 20);
            ctx.fillText(labels[i], x, y);
        }
    }
}

// Location Services Module
class LocationServices {
    constructor() {
        // Using OpenStreetMap only, no API keys needed
    }

    async captureLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation not supported');
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Get address and weather
                    location.address = await this.reverseGeocode(location.latitude, location.longitude);
                    location.weather = await this.getWeather(location.latitude, location.longitude);
                    
                    resolve(location);
                },
                (error) => {
                    reject(error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    async getWeather(lat, lon) {
        try {
            // Using Open-Meteo API - free, no API key required
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`
            );
            
            if (response.ok) {
                const data = await response.json();
                const weatherCode = data.current.weather_code;
                
                // WMO Weather interpretation codes
                const weatherConditions = {
                    0: 'Clear',
                    1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
                    45: 'Foggy', 48: 'Foggy',
                    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
                    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
                    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
                    77: 'Snow Grains',
                    80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
                    85: 'Light Snow Showers', 86: 'Snow Showers',
                    95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Heavy Thunderstorm'
                };
                
                return {
                    temp: Math.round(data.current.temperature_2m),
                    unit: 'F',
                    condition: weatherConditions[weatherCode] || 'Unknown',
                    windSpeed: Math.round(data.current.wind_speed_10m),
                    weatherCode: weatherCode
                };
            }
        } catch (error) {
            console.error('Weather fetch failed:', error);
        }
        
        return null;
    }

    async reverseGeocode(lat, lon) {
        try {
            // Try Nominatim (OpenStreetMap) first - no API key required
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                {
                    headers: {
                        'User-Agent': 'TacticalStopwatch/1.0'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.display_name || 'Location captured';
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        }
        
        return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
    }

    renderMap(containerId, location) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Create tactical-style map visualization
        const mapHTML = `
            <div class="tactical-map">
                <div class="map-overlay">
                    <div class="coordinates-hud">
                        <div class="coord-item">LAT: ${location.latitude.toFixed(6)}°</div>
                        <div class="coord-item">LON: ${location.longitude.toFixed(6)}°</div>
                        <div class="coord-item">ACC: ${location.accuracy ? location.accuracy.toFixed(0) + 'm' : 'N/A'}</div>
                    </div>
                    <div class="location-marker">
                        <div class="marker-pulse"></div>
                        <div class="marker-center"></div>
                    </div>
                </div>
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01},${location.latitude-0.01},${location.longitude+0.01},${location.latitude+0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}"
                    style="border: 1px solid rgba(40, 80, 120, 0.3); filter: hue-rotate(180deg) invert(1) brightness(0.9) contrast(1.2);">
                </iframe>
                <div class="location-address">${location.address || 'Coordinates captured'}</div>
            </div>
        `;
        
        container.innerHTML = mapHTML;
    }
}

// Initialize modules
const analytics = new PerformanceAnalytics();
const locationServices = new LocationServices();
