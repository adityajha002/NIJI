import style from './Category.module.css';

interface CategoryOptionProps {
  Name: string;
  className?: string;
  onClick: () => void;
  category: string;
}

const CategoryOption = ({ Name, className = "", onClick, category }: CategoryOptionProps) => {
  return (
    <div className={`${style.cat_opt} ${className} ${Name === category ? style.active : ""}`.trim()} onClick={onClick}>
      {Name}
    </div>
  );
};

export default CategoryOption;
