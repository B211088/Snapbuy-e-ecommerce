import { useTheme } from "../../Provider/ThemeProvider";

const Search = ({ handleChangeStatusSearchModal }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      onClick={handleChangeStatusSearchModal}
      className="pc:w-full tl:w-full mb:w-full h-[42px] flex items-center mb:justify-end gap-[5px] pc:pl-[10px] pc:pr-[4px] tl:pr-[4px] tl:px-[5px] mb:px-[3px] py-[2px] border-[1px] border-primary rounded-[5px]"
    >
      <input
        className={`w-full font-nunito font-light bg-transparent text-[0.9rem] px-[5px] ${
          isDarkMode ? "text-black" : "text-light-100"
        } outline-none`}
        type="text"
        placeholder="Tìm kiếm sản phẩm"
      />
      <button className="pc:w-[100px] tl:w-[60px] mb:min-w-[32px] h-[32px] flex items-center gap-[3px] outline-none justify-center text-white font-nunito font-medium cursor-pointer bg-primary rounded-[5px]">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
};

export default Search;
