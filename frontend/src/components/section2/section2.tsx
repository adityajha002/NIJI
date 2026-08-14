import style from './section2.module.css';
import Sec2a from './sec2a/sec2a.jsx';
import Sec2b from './sec2b/sec2b.jsx';

const Section2 = () => {
  return (
    <div className={style.main}>
      {/* <Sec2a /> */}
      <Sec2b />
    </div>
  )
}

export default Section2;
