import {extname} from "path"

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

  get newImageName() {
    return `${this.props.id}_${this.props.title.replace(/\s/, '-')}${extname(this.props.imgName)}`
  }

  createStringDocument() {
return `
Title: ${this.props.title}

----

Id: ${this.props.id}

----

Text: ${this.props.text}

----

Tags: ${this.props.tags.toString()}

----

Infoobject: ${this.props.infoObject}

----

Infomaterial: ${this.props.infoMaterial}

----

Infodate: ${this.props.infoDate}-01-01

----

Infolocation: ${this.props.infoLocation}

----

Infomade-in: ${this.props.infoMade_in}

----

Infoprice: ${this.props.infoPrice}

----

Infodimensions: ${this.props.infoDimensions}

----

Infoloan: ${this.props.infoLoan}

----

Images: - ${this.newImageName}

`
  }

}
