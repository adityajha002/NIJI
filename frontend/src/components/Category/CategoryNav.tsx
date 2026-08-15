import type { Dispatch, SetStateAction } from 'react';
import style from './Category.module.css';
import CategoryOption from './CategoryOption';

const categories = ["All", "Grocery", "Dairy & Bakery", "Restaurant", "Medical", "Stationery", "Clothing", "Electronics", "Hardware"] as const;

interface CategoryNavProps {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const CategoryNav = ({ category, setCategory }: CategoryNavProps) => {
  return (
    <>
      <div className={style.cat_nav}>
        {categories.map((option) => {
          return (
            <CategoryOption
              Name={option}
              key={option}
              onClick={() => setCategory(option)}
              category={category}
            />
          );
        })}
      </div>
      <div className={style.sec1bhead}>
        DISCOVER YOUR NEARBY {category === "All" ? "" : category.toUpperCase()} SHOPS WITH NIJI !
      </div>
    </>
  );
};

export default CategoryNav;
