"use client";
import { customFetch } from "@/utilities/fetch";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

type NewestCustomer = {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  _count: { orders: number };
};

const NewestCustomers = () => {
  const { t, isRTL } = useLanguage();

  const { data = [], isLoading } = useQuery({
    queryKey: ["newestCustomers"],
    queryFn: (): Promise<NewestCustomer[]> =>
      customFetch
        .get("customers/newest")
        .then((res) => res.data.customers),
    initialData: [],
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(isRTL ? "ar-EG" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-3 py-4 bg-white dark:bg-surface-mid rounded-lg transition-colors duration-300">
      <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg px-6">
        {t.dashboard.newestCustomers}
      </span>

      <div className="flex flex-col mt-2">
        {/* Header row */}
        <div className="flex flex-row items-center py-2 px-6 bg-gray-100 dark:bg-surface-high text-gray-600 dark:text-on-surface-variant text-sm">
          <div className="w-1/12">#</div>
          <div className="w-4/12">{t.common.name}</div>
          <div className="w-3/12 text-center">{t.dashboard.type}</div>
          <div className="w-2/12 text-center">{t.dashboard.orders}</div>
          <div className="w-2/12 text-end">{t.dashboard.joinDate}</div>
        </div>

        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-row items-center py-3 px-6 border-b border-border dark:border-outline-dark last:border-0 animate-pulse"
              >
                <div className="w-1/12 h-3 bg-gray-200 dark:bg-surface-high rounded" />
                <div className="w-4/12 h-3 bg-gray-200 dark:bg-surface-high rounded mx-2" />
                <div className="w-3/12 h-3 bg-gray-200 dark:bg-surface-high rounded mx-2" />
                <div className="w-2/12 h-3 bg-gray-200 dark:bg-surface-high rounded mx-2" />
                <div className="w-2/12 h-3 bg-gray-200 dark:bg-surface-high rounded" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-400 dark:text-on-surface-variant text-sm">
            {t.dashboard.noOrders}
          </div>
        ) : (
          data.map((customer, i) => (
            <div
              key={customer.id}
              className="flex flex-row items-center py-3 px-6 text-tittle dark:text-on-surface border-b border-border dark:border-outline-dark last:border-0 text-sm"
            >
              <div className="w-1/12 text-gray-400 dark:text-on-surface-variant">
                {i + 1}
              </div>
              <div className="w-4/12 font-medium">{customer.name}</div>
              <div className="w-3/12 flex justify-center">
                <span
                  className={`px-2 py-0.5 rounded-md text-white text-xs ${
                    customer.type === "Male" || customer.type === "Female"
                      ? "bg-success"
                      : "bg-primary"
                  }`}
                >
                  {customer.type}
                </span>
              </div>
              <div className="w-2/12 text-center">
                {customer._count.orders > 0 ? (
                  <span className="font-semibold text-primary">
                    {customer._count.orders}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-on-surface-variant text-xs">
                    {t.dashboard.noOrders}
                  </span>
                )}
              </div>
              <div className="w-2/12 text-end text-gray-500 dark:text-on-surface-variant">
                {formatDate(customer.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewestCustomers;
