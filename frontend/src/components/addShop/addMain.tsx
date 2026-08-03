import style from './addMain.module.css'
import AddShopSec1 from './addShopsSec1/addShopSec1'

const AddMain = () => {
  return (
    <div className={style.main}>
      <AddShopSec1 />
    </div>
  )
}

export default AddMain
