import { useEffect, useState } from "react";
import { useAppData } from "../../contexts/client/AppDataContext";

import { useTheme } from "../../Provider/ThemeProvider";

const FeedBackProduct = ({ productId }) => {
  const { getProductFeedBack } = useAppData();
  const { isDarkMode } = useTheme();
  const [feedBack, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fecthFeedBack = async () => {
      setLoading(true);
      try {
        const response = await getProductFeedBack(productId);
        if (response.success) {
          setFeedBack(response.data);
          setLoading(false);
          return;
        }
      } catch (error) {
        setFeedBack([]);
        setLoading(false);
      }
    };
    fecthFeedBack();
  }, [productId]);

  return (
    <div className="w-full flex flex-col font-nunito">
      <div className="w-full px-[20px] py-[10px] border-b-[1px] border-dashed ">
        <h1 className="font-bold text-[1.2rem]">Đánh giá</h1>
      </div>
      {!loading ? (
        <div className="w-full ">
          <ul className="w-full flex flex-col px-[20px] ">
            {feedBack?.map((item) => (
              <li
                key={item.id}
                className="w-full flex flex-col  px-[10px] py-[20px]  border-b-[1px]"
              >
                <div className="w-full flex  gap-[10px] ">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden aspect-square flex justify-center items-center  ">
                    <img
                      className="w-full h-full aspect-square object-cover"
                      src=""
                      alt=""
                    />
                  </div>
                  <div className="flex-1 flex flex-col ">
                    <div className="flex items-center gap-[5px] pr-[10px] text-[0.9rem]">
                      <span>{item?.user_account}</span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <span className="text-[0.85rem]">Đánh giá</span>
                      <div className="flex items-center gap-[3px] text-[0.8rem]">
                        {" "}
                        {Array.from({
                          length: Math.floor(item?.rating || 0),
                        }).map((_, index) => (
                          <div key={`${item?.id}-${index}`}>
                            <i className="fa-solid fa-star text-yellow-500"></i>
                          </div>
                        ))}
                      </div>
                    </div>{" "}
                    <div
                      className={`w-full flex items-center py-[10px] px-[10px] rounded-[5px] my-[10px] text-[0.9rem] ${
                        isDarkMode
                          ? "bg-dark-900 text-dark-200"
                          : "bg-dark-400 text-light-100"
                      }`}
                    >
                      {item.content}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center p-[20px] ">
          <span> Loading...</span>
        </div>
      )}
    </div>
  );
};

export default FeedBackProduct;
