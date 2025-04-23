import Rank from "../features/Rank";
const InfoShop = ({ info }) => {
  return (
    <div className="w-full flex items-center py-[10px]  cursor-pointer">
      <div className="w-[36px]  h-[36px] ">
        <img
          className="min-w-[36px] min-h-[36px]  h-[36px] object-cover  rounded-full"
          src={info.avatarShop}
          alt=""
        />
      </div>
      <div className="min-w-[120px] flex flex-col px-[5px] font-nunito">
        <div className="flex items-center gap-[8px] ">
          <h3 className=" font-bold text-[0.9rem] overflow-hidden whitespace-nowrap">
            {info.nameShop}
          </h3>
          <div className="font-extrabold ">
            <Rank score={info.score} />
          </div>
        </div>
        <p className="font-normal text-dark-300 text-[0.8rem] truncate  pc:w-full mb:w-[100px]">
          {info.shopTag}
        </p>
      </div>
    </div>
  );
};

export default InfoShop;
