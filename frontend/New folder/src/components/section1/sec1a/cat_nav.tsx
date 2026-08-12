import style from './sec1a.module.css'
import Cat_opt from './cat_opt.jsx'

const categories = ["All", "Grocery", "Dairy & Bakery", "Restaurant", "Medical", "Stationery", "Clothing", "Electronics", "Hardware"] as const;

interface CatNavProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const Cat_nav = ({category, setCategory }: CatNavProps) => {
  return (
      <>
            <div className={style.cat_nav}>
                  {
                        categories.map((option) => {
                              return <Cat_opt Name={option} key={option} onClick={() => setCategory(option)} category={category} />
                        })
                  }
            </div>
            <div className={style.sec1bhead}>
                  DISCOVER YOUR NEARBY {category === "All" ? "" : category.toUpperCase()} SHOPS WITH NIJI !
            </div>
      </>
  )
}

export default Cat_nav
