const AsOrganization = () => {
  return (
    <div>
      <div class=" mx-auto w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
        <span class="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
      </div>

      <div className="mx-auto w-[300px] lg:w-[600] bg-gray-950 rounded-xl overflow-hidden drop-shadow-xl">
        <div className="bg-[#333] flex items-center p-[5px] text-white relative">
          <div className="flex absolute left-3">
            <span className="h-3.5 w-3.5 bg-[#ff605c] rounded-xl mr-2"></span>
            <span className="h-3.5 w-3.5 bg-[#ffbd44] rounded-xl mr-2"></span>
            <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-xl"></span>
          </div>
          <div className="flex-1 text-center text-white">Status</div>
        </div>
        <div className="p-2.5 text-[#0f0]">
          <div>
            <span className="mr-2">We implement this features in future</span>
            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">
              .
            </span>
            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">
              .
            </span>
            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsOrganization;
