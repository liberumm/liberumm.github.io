
// 基本データテンプレート
const baseMonthData = {
  beginningCost: 10000,
  beginningPrice: 12000,
  sales: 8000,
  midPurchaseCost: 6000,
  midPurchasePrice: 7000,
  priceIncrease: 100,
  priceDecrease: 50,
  rebateCost: 30,
  lossRate: 0.03
};

// 部門ごとの基準値（全社を100とした場合の比率）
const departmentRatios = {
  food: 0.5,      // 食品部門は全社の50%
  nonFood: 0.3,   // 非食品部門は全社の30%
  daily: 0.2      // デイリー部門は全社の20%
};

// コーナーごとの基準値（部門を100とした場合の比率）
const cornerRatios = {
  food: {
    produce: 0.4,   // 青果は食品部門の40%
    fish: 0.3,      // 鮮魚は食品部門の30%
    meat: 0.3       // 精肉は食品部門の30%
  },
  nonFood: {
    daily: 0.5,     // 日用品は非食品部門の50%
    clothing: 0.3,  // 衣料品は非食品部門の30%
    other: 0.2      // その他は非食品部門の20%
  },
  daily: {
    dairy: 0.4,     // 乳製品はデイリー部門の40%
    deli: 0.4,      // 惣菜はデイリー部門の40%
    bread: 0.2      // パンはデイリー部門の20%
  }
};

// データ生成用ヘルパー関数
function multiplyData(baseData, ratio) {
  return Object.fromEntries(
    Object.entries(baseData).map(([key, value]) => [key, value * ratio])
  );
}

// 全社のサンプルデータ
const companyData = {
  prev: { ...baseMonthData },
  current: multiplyData(baseMonthData, 1.1),    // 前月比10%増
  next: multiplyData(baseMonthData, 1.15)       // 前月比15%増
};

// 部門のサンプルデータ
const departmentData = {
  food: {
    prev: multiplyData(baseMonthData, departmentRatios.food),
    current: multiplyData(multiplyData(baseMonthData, 1.1), departmentRatios.food),
    next: multiplyData(multiplyData(baseMonthData, 1.15), departmentRatios.food)
  },
  nonFood: {
    prev: multiplyData(baseMonthData, departmentRatios.nonFood),
    current: multiplyData(multiplyData(baseMonthData, 1.1), departmentRatios.nonFood),
    next: multiplyData(multiplyData(baseMonthData, 1.15), departmentRatios.nonFood)
  },
  daily: {
    prev: multiplyData(baseMonthData, departmentRatios.daily),
    current: multiplyData(multiplyData(baseMonthData, 1.1), departmentRatios.daily),
    next: multiplyData(multiplyData(baseMonthData, 1.15), departmentRatios.daily)
  }
};

// エクスポート用の完全なデータ構造
const sampleMonthlyData = {
  company: companyData,
  departments: [
    {
      id: 'department_1',
      label: '食品部門',
      data: departmentData.food,
      corners: [
        {
          id: 'corner_1_1',
          label: '青果コーナー',
          data: {
            prev: multiplyData(departmentData.food.prev, cornerRatios.food.produce),
            current: multiplyData(departmentData.food.current, cornerRatios.food.produce),
            next: multiplyData(departmentData.food.next, cornerRatios.food.produce)
          }
        },
        {
          id: 'corner_1_2',
          label: '鮮魚コーナー',
          data: {
            prev: multiplyData(departmentData.food.prev, cornerRatios.food.fish),
            current: multiplyData(departmentData.food.current, cornerRatios.food.fish),
            next: multiplyData(departmentData.food.next, cornerRatios.food.fish)
          }
        },
        {
          id: 'corner_1_3',
          label: '精肉コーナー',
          data: {
            prev: multiplyData(departmentData.food.prev, cornerRatios.food.meat),
            current: multiplyData(departmentData.food.current, cornerRatios.food.meat),
            next: multiplyData(departmentData.food.next, cornerRatios.food.meat)
          }
        }
      ]
    },
    // ...他の部門も同様に定義
  ]
};

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.sampleMonthlyData = sampleMonthlyData;
}

// モジュールエクスポート（必要に応じて）
export { sampleMonthlyData, baseMonthData, departmentRatios, cornerRatios };
