import Navbar from '../../components/Navbar/Navbar';
import ShopForm from './components/ShopForm';
import style from './AddShop.module.css';

function AddShop() {
  return (
    <>
      <Navbar />
      <div className={style.main}>
        <ShopForm />
      </div>
    </>
  );
}

export default AddShop;
