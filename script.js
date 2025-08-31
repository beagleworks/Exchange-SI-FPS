document.getElementById('converter-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const value = parseFloat(document.getElementById('value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(value)) {
        document.getElementById('result').textContent = '有効な数値を入力してください。';
        return;
    }
    
    let result;
    try {
        result = convertUnit(value, fromUnit, toUnit);
        document.getElementById('result').textContent = `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
    } catch (error) {
        document.getElementById('result').textContent = error.message;
    }
});

// 変換方向の変更時に単位選択を更新
document.querySelectorAll('input[name="direction"]').forEach(radio => {
    radio.addEventListener('change', updateUnits);
});

// 変換元単位の変更時に変換先単位をフィルタリング
document.getElementById('from-unit').addEventListener('change', function() {
    const direction = document.querySelector('input[name="direction"]:checked').value;
    updateToUnits(direction, this.value);
});

function updateUnits() {
    const direction = document.querySelector('input[name="direction"]:checked').value;
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    
    if (direction === 'us-to-si') {
        fromUnitSelect.innerHTML = `
            <option value="inch">インチ (inch)</option>
            <option value="foot">フィート (foot)</option>
            <option value="yard">ヤード (yard)</option>
            <option value="mile">マイル (mile)</option>
            <option value="pound">ポンド (pound)</option>
            <option value="ounce">オンス (ounce)</option>
            <option value="fahrenheit">華氏 (Fahrenheit)</option>
        `;
        toUnitSelect.innerHTML = `
            <option value="cm">センチメートル (cm)</option>
            <option value="m">メートル (m)</option>
            <option value="km">キロメートル (km)</option>
            <option value="kg">キログラム (kg)</option>
            <option value="g">グラム (g)</option>
            <option value="celsius">摂氏 (Celsius)</option>
        `;
    } else {
        fromUnitSelect.innerHTML = `
            <option value="cm">センチメートル (cm)</option>
            <option value="m">メートル (m)</option>
            <option value="km">キロメートル (km)</option>
            <option value="kg">キログラム (kg)</option>
            <option value="g">グラム (g)</option>
            <option value="celsius">摂氏 (Celsius)</option>
        `;
        toUnitSelect.innerHTML = `
            <option value="inch">インチ (inch)</option>
            <option value="foot">フィート (foot)</option>
            <option value="yard">ヤード (yard)</option>
            <option value="mile">マイル (mile)</option>
            <option value="pound">ポンド (pound)</option>
            <option value="ounce">オンス (ounce)</option>
            <option value="fahrenheit">華氏 (Fahrenheit)</option>
        `;
    }
    
    // 初期選択でフィルタリング
    updateToUnits(direction, fromUnitSelect.value);
}

function updateToUnits(direction, fromUnit) {
    const toUnitSelect = document.getElementById('to-unit');
    const unitCategories = direction === 'us-to-si' ? {
        length: ['inch', 'foot', 'yard', 'mile'],
        weight: ['pound', 'ounce'],
        temperature: ['fahrenheit']
    } : {
        length: ['cm', 'm', 'km'],
        weight: ['kg', 'g'],
        temperature: ['celsius']
    };
    const targetCategories = direction === 'us-to-si' ? {
        length: ['cm', 'm', 'km'],
        weight: ['kg', 'g'],
        temperature: ['celsius']
    } : {
        length: ['inch', 'foot', 'yard', 'mile'],
        weight: ['pound', 'ounce'],
        temperature: ['fahrenheit']
    };
    
    let category;
    if (unitCategories.length.includes(fromUnit)) {
        category = 'length';
    } else if (unitCategories.weight.includes(fromUnit)) {
        category = 'weight';
    } else if (unitCategories.temperature.includes(fromUnit)) {
        category = 'temperature';
    }
    
    // 既存のオプションをクリア
    toUnitSelect.innerHTML = '';
    
    // 新しいオプションを追加
    targetCategories[category].forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit === 'cm' ? 'センチメートル (cm)' :
                             unit === 'm' ? 'メートル (m)' :
                             unit === 'km' ? 'キロメートル (km)' :
                             unit === 'kg' ? 'キログラム (kg)' :
                             unit === 'g' ? 'グラム (g)' :
                             unit === 'celsius' ? '摂氏 (Celsius)' :
                             unit === 'inch' ? 'インチ (inch)' :
                             unit === 'foot' ? 'フィート (foot)' :
                             unit === 'yard' ? 'ヤード (yard)' :
                             unit === 'mile' ? 'マイル (mile)' :
                             unit === 'pound' ? 'ポンド (pound)' :
                             unit === 'ounce' ? 'オンス (ounce)' :
                             '華氏 (Fahrenheit)';
        toUnitSelect.appendChild(option);
    });
}

// 初期ロード時に更新
document.addEventListener('DOMContentLoaded', function() {
    updateUnits();
});

function convertUnit(value, from, to) {
    // 長さ変換 (US to SI)
    const lengthConversionsUSToSI = {
        inch: { cm: 2.54, m: 0.0254, km: 0.0000254 },
        foot: { cm: 30.48, m: 0.3048, km: 0.0003048 },
        yard: { cm: 91.44, m: 0.9144, km: 0.0009144 },
        mile: { cm: 160934.4, m: 1609.344, km: 1.609344 }
    };
    
    // 長さ変換 (SI to US)
    const lengthConversionsSIToUS = {
        cm: { inch: 1 / 2.54, foot: 1 / 30.48, yard: 1 / 91.44, mile: 1 / 160934.4 },
        m: { inch: 1 / 0.0254, foot: 1 / 0.3048, yard: 1 / 0.9144, mile: 1 / 1609.344 },
        km: { inch: 1 / 0.0000254, foot: 1 / 0.0003048, yard: 1 / 0.0009144, mile: 1 / 1.609344 }
    };
    
    // 重量変換 (US to SI)
    const weightConversionsUSToSI = {
        pound: { kg: 0.453592, g: 453.592 },
        ounce: { kg: 0.0283495, g: 28.3495 }
    };
    
    // 重量変換 (SI to US)
    const weightConversionsSIToUS = {
        kg: { pound: 1 / 0.453592, ounce: 1 / 0.0283495 },
        g: { pound: 1 / 453.592, ounce: 1 / 28.3495 }
    };
    
    // 温度変換
    if (from === 'fahrenheit' && to === 'celsius') {
        return (value - 32) * 5 / 9;
    }
    if (from === 'celsius' && to === 'fahrenheit') {
        return (value * 9 / 5) + 32;
    }
    
    // 長さ変換 (US to SI)
    if (lengthConversionsUSToSI[from] && lengthConversionsUSToSI[from][to]) {
        return value * lengthConversionsUSToSI[from][to];
    }
    
    // 長さ変換 (SI to US)
    if (lengthConversionsSIToUS[from] && lengthConversionsSIToUS[from][to]) {
        return value * lengthConversionsSIToUS[from][to];
    }
    
    // 重量変換 (US to SI)
    if (weightConversionsUSToSI[from] && weightConversionsUSToSI[from][to]) {
        return value * weightConversionsUSToSI[from][to];
    }
    
    // 重量変換 (SI to US)
    if (weightConversionsSIToUS[from] && weightConversionsSIToUS[from][to]) {
        return value * weightConversionsSIToUS[from][to];
    }
    
    throw new Error('この変換はサポートされていません。');
}