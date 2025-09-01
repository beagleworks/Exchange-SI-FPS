const texts = {
    ja: {
        title: "単位変換器",
        directionLabel: "変換方向:",
        usToSi: "アメリカヤードポンド法 → 国際単位",
        siToUs: "国際単位 → アメリカヤードポンド法",
        fromUnit: "変換元単位:",
        toUnit: "変換先単位:",
        convert: "変換",
        invalidValue: "有効な数値を入力してください。",
        unsupported: "この変換はサポートされていません。",
        units: {
            inch: "インチ (inch)",
            foot: "フィート (foot)",
            yard: "ヤード (yard)",
            mile: "マイル (mile)",
            pound: "ポンド (pound)",
            ounce: "オンス (ounce)",
            fahrenheit: "華氏 (Fahrenheit)",
            sqft: "平方フィート (sqft)",
            gallon: "ガロン (gallon)",
            mph: "マイル/時 (mph)",
            cm: "センチメートル (cm)",
            m: "メートル (m)",
            km: "キロメートル (km)",
            kg: "キログラム (kg)",
            g: "グラム (g)",
            celsius: "摂氏 (Celsius)",
            sqm: "平方メートル (sqm)",
            liter: "リットル (liter)",
            kmh: "km/h (kmh)"
        }
    },
    en: {
        title: "Unit Converter",
        directionLabel: "Conversion Direction:",
        usToSi: "US Customary → SI Units",
        siToUs: "SI Units → US Customary",
        fromUnit: "From Unit:",
        toUnit: "To Unit:",
        convert: "Convert",
        invalidValue: "Please enter a valid number.",
        unsupported: "This conversion is not supported.",
        units: {
            inch: "Inch (inch)",
            foot: "Foot (foot)",
            yard: "Yard (yard)",
            mile: "Mile (mile)",
            pound: "Pound (pound)",
            ounce: "Ounce (ounce)",
            fahrenheit: "Fahrenheit (Fahrenheit)",
            sqft: "Square Foot (sqft)",
            gallon: "Gallon (gallon)",
            mph: "Miles per Hour (mph)",
            cm: "Centimeter (cm)",
            m: "Meter (m)",
            km: "Kilometer (km)",
            kg: "Kilogram (kg)",
            g: "Gram (g)",
            celsius: "Celsius (Celsius)",
            sqm: "Square Meter (sqm)",
            liter: "Liter (liter)",
            kmh: "km/h (kmh)"
        }
    }
};

let currentLang = 'ja';

document.getElementById('converter-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const value = parseFloat(document.getElementById('value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(value)) {
        document.getElementById('result').textContent = texts[currentLang].invalidValue;
        return;
    }
    
    let result;
    try {
        result = convertUnit(value, fromUnit, toUnit);
        document.getElementById('result').textContent = `${value} ${texts[currentLang].units[fromUnit]} = ${result.toFixed(4)} ${texts[currentLang].units[toUnit]}`;
    } catch (error) {
        document.getElementById('result').textContent = texts[currentLang].unsupported;
    }
});

// 言語切り替え
document.querySelectorAll('input[name="language"]').forEach(radio => {
    radio.addEventListener('change', function() {
        currentLang = this.value;
        updateLanguage();
    });
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
        temperature: ['fahrenheit'],
        area: ['sqft'],
        volume: ['gallon'],
        speed: ['mph']
    } : {
        length: ['cm', 'm', 'km'],
        weight: ['kg', 'g'],
        temperature: ['celsius'],
        area: ['sqm'],
        volume: ['liter'],
        speed: ['kmh']
    };
    const targetCategories = direction === 'us-to-si' ? {
        length: ['cm', 'm', 'km'],
        weight: ['kg', 'g'],
        temperature: ['celsius'],
        area: ['sqm'],
        volume: ['liter'],
        speed: ['kmh']
    } : {
        length: ['inch', 'foot', 'yard', 'mile'],
        weight: ['pound', 'ounce'],
        temperature: ['fahrenheit'],
        area: ['sqft'],
        volume: ['gallon'],
        speed: ['mph']
    };
    
    let category;
    if (unitCategories.length.includes(fromUnit)) {
        category = 'length';
    } else if (unitCategories.weight.includes(fromUnit)) {
        category = 'weight';
    } else if (unitCategories.temperature.includes(fromUnit)) {
        category = 'temperature';
    } else if (unitCategories.area.includes(fromUnit)) {
        category = 'area';
    } else if (unitCategories.volume.includes(fromUnit)) {
        category = 'volume';
    } else if (unitCategories.speed.includes(fromUnit)) {
        category = 'speed';
    }
    
    // 既存のオプションをクリア
    toUnitSelect.innerHTML = '';
    
    // 新しいオプションを追加
    targetCategories[category].forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = texts[currentLang].units[unit];
        toUnitSelect.appendChild(option);
    });
}

function updateLanguage() {
    document.getElementById('title').textContent = texts[currentLang].title;
    document.getElementById('direction-label').textContent = texts[currentLang].directionLabel;
    document.getElementById('us-to-si-label').textContent = texts[currentLang].usToSi;
    document.getElementById('si-to-us-label').textContent = texts[currentLang].siToUs;
    document.getElementById('from-unit-label').textContent = texts[currentLang].fromUnit;
    document.getElementById('to-unit-label').textContent = texts[currentLang].toUnit;
    document.getElementById('convert-button').textContent = texts[currentLang].convert;
    // 単位オプションのテキストも更新
    updateUnits();
}

function updateUnits() {
    const direction = document.querySelector('input[name="direction"]:checked').value;
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    
    if (direction === 'us-to-si') {
        fromUnitSelect.innerHTML = `
            <option value="inch">${texts[currentLang].units.inch}</option>
            <option value="foot">${texts[currentLang].units.foot}</option>
            <option value="yard">${texts[currentLang].units.yard}</option>
            <option value="mile">${texts[currentLang].units.mile}</option>
            <option value="pound">${texts[currentLang].units.pound}</option>
            <option value="ounce">${texts[currentLang].units.ounce}</option>
            <option value="fahrenheit">${texts[currentLang].units.fahrenheit}</option>
            <option value="sqft">${texts[currentLang].units.sqft}</option>
            <option value="gallon">${texts[currentLang].units.gallon}</option>
            <option value="mph">${texts[currentLang].units.mph}</option>
        `;
        toUnitSelect.innerHTML = `
            <option value="cm">${texts[currentLang].units.cm}</option>
            <option value="m">${texts[currentLang].units.m}</option>
            <option value="km">${texts[currentLang].units.km}</option>
            <option value="kg">${texts[currentLang].units.kg}</option>
            <option value="g">${texts[currentLang].units.g}</option>
            <option value="celsius">${texts[currentLang].units.celsius}</option>
            <option value="sqm">${texts[currentLang].units.sqm}</option>
            <option value="liter">${texts[currentLang].units.liter}</option>
            <option value="kmh">${texts[currentLang].units.kmh}</option>
        `;
    } else {
        fromUnitSelect.innerHTML = `
            <option value="cm">${texts[currentLang].units.cm}</option>
            <option value="m">${texts[currentLang].units.m}</option>
            <option value="km">${texts[currentLang].units.km}</option>
            <option value="kg">${texts[currentLang].units.kg}</option>
            <option value="g">${texts[currentLang].units.g}</option>
            <option value="celsius">${texts[currentLang].units.celsius}</option>
            <option value="sqm">${texts[currentLang].units.sqm}</option>
            <option value="liter">${texts[currentLang].units.liter}</option>
            <option value="kmh">${texts[currentLang].units.kmh}</option>
        `;
        toUnitSelect.innerHTML = `
            <option value="inch">${texts[currentLang].units.inch}</option>
            <option value="foot">${texts[currentLang].units.foot}</option>
            <option value="yard">${texts[currentLang].units.yard}</option>
            <option value="mile">${texts[currentLang].units.mile}</option>
            <option value="pound">${texts[currentLang].units.pound}</option>
            <option value="ounce">${texts[currentLang].units.ounce}</option>
            <option value="fahrenheit">${texts[currentLang].units.fahrenheit}</option>
            <option value="sqft">${texts[currentLang].units.sqft}</option>
            <option value="gallon">${texts[currentLang].units.gallon}</option>
            <option value="mph">${texts[currentLang].units.mph}</option>
        `;
    }
    
    // 初期選択でフィルタリング
    updateToUnits(direction, fromUnitSelect.value);
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
    
    // 面積変換 (US to SI)
    const areaConversionsUSToSI = {
        sqft: { sqm: 0.092903 }
    };
    
    // 面積変換 (SI to US)
    const areaConversionsSIToUS = {
        sqm: { sqft: 1 / 0.092903 }
    };
    
    // 体積変換 (US to SI)
    const volumeConversionsUSToSI = {
        gallon: { liter: 3.78541 }
    };
    
    // 体積変換 (SI to US)
    const volumeConversionsSIToUS = {
        liter: { gallon: 1 / 3.78541 }
    };
    
    // 速度変換 (US to SI)
    const speedConversionsUSToSI = {
        mph: { kmh: 1.60934 }
    };
    
    // 速度変換 (SI to US)
    const speedConversionsSIToUS = {
        kmh: { mph: 1 / 1.60934 }
    };
    
    // 温度変換
    if (from === 'fahrenheit' && to === 'celsius') {
        return (value - 32) * 5 / 9;
    }
    if (from === 'celsius' && to === 'fahrenheit') {
        return (value * 9 / 5) + 32;
    }
    
    // 長さ変換
    if (lengthConversionsUSToSI[from] && lengthConversionsUSToSI[from][to]) {
        return value * lengthConversionsUSToSI[from][to];
    }
    if (lengthConversionsSIToUS[from] && lengthConversionsSIToUS[from][to]) {
        return value * lengthConversionsSIToUS[from][to];
    }
    
    // 重量変換
    if (weightConversionsUSToSI[from] && weightConversionsUSToSI[from][to]) {
        return value * weightConversionsUSToSI[from][to];
    }
    if (weightConversionsSIToUS[from] && weightConversionsSIToUS[from][to]) {
        return value * weightConversionsSIToUS[from][to];
    }
    
    // 面積変換
    if (areaConversionsUSToSI[from] && areaConversionsUSToSI[from][to]) {
        return value * areaConversionsUSToSI[from][to];
    }
    if (areaConversionsSIToUS[from] && areaConversionsSIToUS[from][to]) {
        return value * areaConversionsSIToUS[from][to];
    }
    
    // 体積変換
    if (volumeConversionsUSToSI[from] && volumeConversionsUSToSI[from][to]) {
        return value * volumeConversionsUSToSI[from][to];
    }
    if (volumeConversionsSIToUS[from] && volumeConversionsSIToUS[from][to]) {
        return value * volumeConversionsSIToUS[from][to];
    }
    
    // 速度変換
    if (speedConversionsUSToSI[from] && speedConversionsUSToSI[from][to]) {
        return value * speedConversionsUSToSI[from][to];
    }
    if (speedConversionsSIToUS[from] && speedConversionsSIToUS[from][to]) {
        return value * speedConversionsSIToUS[from][to];
    }
    
    throw new Error(texts[currentLang].unsupported);
}