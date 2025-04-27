function calculate() {
    // Retrieve inputs for print and material calculations
    const beadWidth = parseFloat(document.getElementById('beadWidth').value);
    const beadHeight = parseFloat(document.getElementById('beadHeight').value);
    const linearFeet = parseFloat(document.getElementById('linearFeet').value);
    const printSpeed = parseFloat(document.getElementById('printSpeed').value);
    const uptime = parseFloat(document.getElementById('uptime').value) / 100;
    const materialCostPerYd = parseFloat(document.getElementById('materialCost').value);

    const operatorCost = parseFloat(document.getElementById('operatorCost').value) || 0;
    const machineCost = parseFloat(document.getElementById('machineCost').value) || 0;
    const contingency = parseFloat(document.getElementById('contingency').value) / 100 || 0.05;

    // Mix Design Inputs (new)
    const cementAmount = parseFloat(document.getElementById('cementAmount').value) || 0;
    const cementType = document.getElementById('cementType').value;
    const aggregateAmount = parseFloat(document.getElementById('aggregateAmount').value) || 0;
    const additiveAmount = parseFloat(document.getElementById('additiveAmount').value) || 0;
    const flyAshAmount = parseFloat(document.getElementById('flyAshAmount').value) || 0;
    const waterAmount = parseFloat(document.getElementById('waterAmount').value) || 0;

    // Volume Calculations
    const totalInches = linearFeet * 12;
    const crossSectionArea = beadWidth * beadHeight;
    const volumeInCubicInches = crossSectionArea * totalInches;
    const cubicYards = volumeInCubicInches / 46656;  // 1 cubic yard = 46,656 cubic inches
    const cubicMeters = cubicYards * 0.764555;  // Convert cubic yards to cubic meters

    const materialCost = cubicYards * materialCostPerYd;

    // Print Time Calculation
    const printTimeSeconds = totalInches / (printSpeed * uptime);
    const printTimeHours = printTimeSeconds / 3600;

    // Costs
    const laborCost = printTimeHours * operatorCost;
    const machineRunCost = printTimeHours * machineCost;

    let subtotal = materialCost + laborCost + machineRunCost;
    let totalCost = subtotal + (subtotal * contingency);

    // Waste Estimate
    const wastePercent = (1 - uptime);  // Downtime is waste percentage
    const wasteVolume = cubicYards * wastePercent;  // Waste in cubic yards

    // Carbon Emissions Calculation
    const traditionalCO2perCY = 181.44;  // 400 lbs ≈ 181.44 kg CO₂ per cubic yard
    const dpcCO2perCY = cementType === "portland" ? 291 : 250;  // Adjust CO₂ for cement type

    // Emissions based on mix design (user input)
    const cementCO2 = cementAmount * 0.9;  // Cement CO2 factor
    const aggregateCO2 = aggregateAmount * 0.03;  // Approx. CO₂ for aggregates (depends on transport)
    const additiveCO2 = additiveAmount * 0.05;  // Small contribution for additives
    const flyAshCO2 = flyAshAmount * 0.4;  // Approx. CO₂ for fly ash

    const totalCO2 = cementCO2 + aggregateCO2 + additiveCO2 + flyAshCO2;  // Total CO₂ from user input
    const traditionalCO2 = cubicYards * traditionalCO2perCY;

    // Define the adjusted 3DPC volume based on 30% reduction
    const adjusted3DPCVolume = cubicYards * 0.7;  // 30% volume reduction for 3DPC

    const dpcCO2 = adjusted3DPCVolume * dpcCO2perCY;

    const carbonSavings = traditionalCO2 - dpcCO2;

    let carbonMsg = carbonSavings > 0
        ? `Estimated Carbon Savings: ${carbonSavings.toFixed(2)} kg CO₂ compared to traditional concrete.`
        : `3DCP's carbon emissions depend on mix design and material optimization. For the best results, consider adjusting your mix to reduce CO₂ emissions.`;

    // Efficiency Score Calculation
    const speedFactor = printSpeed / 3;  // Assuming 3 in/sec is average speed
    const efficiencyScore = Math.min(100, (uptime * 100) * speedFactor - (wastePercent * 50));

    document.getElementById('results').innerHTML = `
        <p><strong>Total Volume:</strong> ${cubicYards.toFixed(2)} yd³ (${cubicMeters.toFixed(2)} m³)</p>
        <p><strong>Waste Estimate:</strong> ${wasteVolume.toFixed(2)} yd³ (${(wastePercent*100).toFixed(1)}% downtime)</p>
        <p><strong>Total Print Time:</strong> ${printTimeHours.toFixed(2)} hours</p>
        <p><strong>Material Cost:</strong> $${materialCost.toFixed(2)}</p>
        <p><strong>Labor Cost:</strong> $${laborCost.toFixed(2)}</p>
        <p><strong>Machine Cost:</strong> $${machineRunCost.toFixed(2)}</p>
        <p><strong>Contingency (${(contingency*100).toFixed(1)}%):</strong> $${(subtotal * contingency).toFixed(2)}</p>
        <h3>Total Estimated Cost: $${totalCost.toFixed(2)}</h3>
        <hr>
        <p>${carbonMsg}</p>
        <p><strong>Efficiency Score:</strong> ${efficiencyScore.toFixed(1)}%</p>
    `;
}

function toggleAdvanced() {
    const adv = document.getElementById('advancedOptions');
    adv.style.display = adv.style.display === 'none' ? 'block' : 'none';
}

function downloadPDF() {
    alert("PDF Export coming soon! (We’ll integrate jsPDF here.)");
}
