const EmptyCart = ({ navigate }) => (
  <div className="w-full py-16 flex flex-col items-center justify-center">
    <p className="text-xl font-medium mb-4">Giỏ hàng của bạn đang trống</p>
    <button
      onClick={() => navigate("/")}
      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      Tiếp tục mua sắm
    </button>
  </div>
);

export default EmptyCart;
