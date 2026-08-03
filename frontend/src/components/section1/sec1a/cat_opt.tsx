import style from './sec1a.module.css'

interface CatOptProps {
  Name: string;
  className?: string;
  onClick: () => void;
  category: string;
}
const Cat_opt = ({ Name, className = "", onClick, category }: CatOptProps) => {
  return (
    <div className={`${style.cat_opt} ${className} ${Name === category ? style.active : ""}`.trim()} onClick={onClick}>
      {Name}
    </div>
  )
}

export default Cat_opt
