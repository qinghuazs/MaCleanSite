// 官网里所有"要你来定"的信息都集中在这里，改这一个文件即可。

export const site = {
  name: 'Maclean',
  /** 当前版本号，显示在下载区 */
  version: '1.4.3',
  /** 最低系统要求 */
  minMacOS: '26.1',

  /** 客服与退款联系邮箱 */
  contactEmail: 'dongmian2019@gmail.com',
  /** 开发者的 GitHub 主页 */
  githubUrl: 'https://github.com/qinghuazs',

  /** dmg 下载地址（例如公开仓库的 GitHub Releases）。留空时下载按钮显示"即将开放下载" */
  downloadUrl: '',
  /** Dodo Payments 正式环境的产品 ID（pdt_…），和应用里 LicenseConfig.productIDs[.live] 一致。留空时购买按钮显示"即将开放购买" */
  dodoProductId: '',
  /** 测试阶段可改成 true，购买按钮走 test.checkout.dodopayments.com */
  dodoTestMode: false,

  /** 在售产品名，和 Dodo 后台的产品名一致（收据、邮件里显示的就是它） */
  productName: 'Maclean Pro',
  /** 价格，原样显示；和 Dodo 产品定价一致（测试模式 Maclean Pro 为 $10 买断） */
  price: { zh: 'US$10', en: 'US$10' },
  /** 每个许可证可同时激活的 Mac 数量，和 Dodo 许可证权益的激活上限一致 */
  devicesPerLicense: 1,
  /** 无理由退款天数 */
  refundDays: 3,
  /** 政策页的生效日期 */
  policyDate: '2026-11-04',
} as const

/** 激活台数的说法：1 台时不说“最多”，英文单复数也不同 */
export const macs = {
  zh: site.devicesPerLicense === 1 ? '1 台' : `最多 ${site.devicesPerLicense} 台`,
  en: site.devicesPerLicense === 1 ? 'one Mac' : `up to ${site.devicesPerLicense} Macs`,
}

/** Dodo 托管结账页的静态支付链接 */
export function purchaseUrl(): string | null {
  if (!site.dodoProductId) return null
  const host = site.dodoTestMode ? 'https://test.checkout.dodopayments.com' : 'https://checkout.dodopayments.com'
  return `${host}/buy/${site.dodoProductId}?quantity=1`
}
