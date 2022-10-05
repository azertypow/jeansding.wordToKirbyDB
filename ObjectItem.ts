export interface IObjectItemProperties {
  id              : string
  title           : string
  tags            : string[]
  imgName         : string
  text            : string

  infoObject      : string
  infoMaterial    : string
  infoDate        : string
  infoLocation    : string
  infoMade_in     : string
  infoPrice       : string
  infoDimensions  : string
  infoLoan        : string
}

export class ObjectItem {

  constructor(
    public props: IObjectItemProperties,
  ) {

  }
}
