import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import styles from "./edit.module.css";
import Loading from "../../components/loading/loading.js";
import { API_BASE_URL } from "../../config/api.js";

interface Shop {
  shopname: string;
  category: string;
  description: string;
  pincode: string;
  tags: string;
  subcategory: string;
  latitude: number | null;
  longitude: number | null;
}

interface ShopFormData {
  shopName: string;
  category: string;
  address: string;
  pincode: string;
  tags: string;
  subCategory: string;
  latitude: number | "";
  longitude: number | "";
}

type LocationStatus = "idle" | "loading" | "done" | "error";

type StyleKey = keyof typeof styles;

const CATEGORY_OPTIONS = [
  "Grocery",
  "Dairy & Bakery",
  "Restaurant",
  "Medical",
  "Stationery",
  "Clothing",
  "Electronics",
  "Hardware",
  "Clothing & Fashion",
  "Food & Beverage",
  "Home & Living",
  "Health & Wellness",
  "Other",
] as const;

const cx = (...classNames: Array<string | false | null | undefined>): string =>
  classNames
    .filter((name): name is string => Boolean(name))
    .map((className) => styles[className as StyleKey])
    .filter(Boolean)
    .join(" ");

const toFormValues = (shop: Partial<Shop> = {}): ShopFormData => ({
  shopName: shop.shopname || "",
  category: shop.category || "",
  address: shop.description || "",
  pincode: shop.pincode || "",
  tags: shop.tags || "",
  subCategory: shop.subcategory || "",
  latitude: shop.latitude ?? "",
  longitude: shop.longitude ?? "",
});

export default function EditShopForm() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormData>({
    defaultValues: {
      shopName: "",
      category: "",
      address: "",
      pincode: "",
      tags: "",
      subCategory: "",
      latitude: "",
      longitude: "",
    },
  });

  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const [pageError, setPageError] = useState<string>("");
  const [loadingShop, setLoadingShop] = useState<boolean>(true);

  const handleAuthError = useCallback(() => {
    logout();
    navigate("/auth", { replace: true });
  }, [logout, navigate]);

  useEffect(() => {
    const fetchShop = async () => {
      setLoadingShop(true);
      setPageError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/shops/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }

        const result: Partial<Shop> & { error?: string } = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.error || `Failed to load shop (${response.status})`);
        }

        reset(toFormValues(result));
        setLocationStatus(result.latitude && result.longitude ? "done" : "idle");
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Could not load shop data.");
      } finally {
        setLoadingShop(false);
      }
    };

    if (token) {
      fetchShop();
    }
  }, [token, reset, handleAuthError]);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setValue("latitude", position.coords.latitude, { shouldDirty: true });
        setValue("longitude", position.coords.longitude, { shouldDirty: true });
        setLocationStatus("done");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const onSubmit = async (data: ShopFormData) => {
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/shops/dashboard`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.shopName,
          category: data.category,
          description: data.address,
          pincode: data.pincode,
          tags: data.tags,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      const result: Partial<Shop> & { error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || `Failed to update shop (${response.status})`);
      }

      reset(toFormValues(result));
      setSubmitSuccess("Shop updated successfully.");
      setLocationStatus(result.latitude && result.longitude ? "done" : "idle");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (loadingShop) {
    return <Loading message="Loading shop" />;
  }

  return (
    <div className={styles["edit-shop"]}>
      <div className={styles.left}>
        <div className={styles["edit-shop__card"]}>
          <h1 className={styles["edit-shop__title"]}>Editing Your Shop</h1>

          <form className={styles["edit-shop__form"]} onSubmit={handleSubmit(onSubmit)} noValidate>
            {pageError && <p className={styles["edit-shop__form-error"]}>{pageError}</p>}

            <div className={styles["edit-shop__field"]}>
              <input
                className={cx("edit-shop__input", errors.shopName && "edit-shop__input--error")}
                placeholder="Shop name"
                aria-label="Shop name"
                disabled={Boolean(pageError)}
                {...register("shopName", { required: "Shop name is required" })}
              />
              {errors.shopName && <span className={styles["edit-shop__error"]}>{errors.shopName.message}</span>}
            </div>

            <div className={styles["edit-shop__field"]}>
              <select
                className={cx("edit-shop__input", "edit-shop__select", errors.category && "edit-shop__input--error")}
                aria-label="Category"
                defaultValue=""
                disabled={Boolean(pageError)}
                {...register("category", { required: "Please choose a category" })}
              >
                <option value="" disabled>
                  Category
                </option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.category && <span className={styles["edit-shop__error"]}>{errors.category.message}</span>}
            </div>

            <div className={styles["edit-shop__field"]}>
              <textarea
                className={cx("edit-shop__input", "edit-shop__textarea", errors.address && "edit-shop__input--error")}
                placeholder="Address"
                aria-label="Address"
                rows={3}
                disabled={Boolean(pageError)}
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <span className={styles["edit-shop__error"]}>{errors.address.message}</span>}
            </div>

            <div className={styles["edit-shop__row"]}>
              <div className={cx("edit-shop__field", "edit-shop__field--third")}>
                <input
                  className={cx("edit-shop__input", errors.pincode && "edit-shop__input--error")}
                  placeholder="Pincode"
                  aria-label="Pincode"
                  inputMode="numeric"
                  disabled={Boolean(pageError)}
                  {...register("pincode", {
                    required: "Required",
                    pattern: { value: /^\d{6}$/, message: "6 digits" },
                  })}
                />
                {errors.pincode && <span className={styles["edit-shop__error"]}>{errors.pincode.message}</span>}
              </div>

              <div className={cx("edit-shop__field", "edit-shop__field--third")}>
                <input
                  className={styles["edit-shop__input"]}
                  placeholder="Tags"
                  aria-label="Tags"
                  {...register("tags")}
                />
              </div>

              <div className={cx("edit-shop__field", "edit-shop__field--third")}>
                <input
                  className={styles["edit-shop__input"]}
                  placeholder="Sub-category (not saved yet)"
                  aria-label="Sub-category"
                  disabled
                  {...register("subCategory")}
                />
              </div>
            </div>

            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />

            <div className={styles["edit-shop__actions"]}>
              <button
                type="button"
                className={cx(
                  "edit-shop__button",
                  "edit-shop__button--ghost",
                  "edit-shop__button--location",
                  `edit-shop__button--${locationStatus}`
                )}
                onClick={handleLocationClick}
                disabled={Boolean(pageError)}
              >
                {locationStatus === "loading" && "Locating..."}
                {locationStatus === "done" && "Location captured"}
                {locationStatus === "error" && "Try again"}
                {locationStatus === "idle" && "Location"}
              </button>

              <button
                type="submit"
                className={cx("edit-shop__button", "edit-shop__button--submit")}
                disabled={isSubmitting || Boolean(pageError)}
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>

            {submitError && <p className={styles["edit-shop__form-error"]}>{submitError}</p>}
            {submitSuccess && <p className={styles["edit-shop__form-success"]}>{submitSuccess}</p>}
          </form>
        </div>
      </div>

      <div className={styles["edit-shop__products-area"]} aria-hidden="true" />
    </div>
  );
}