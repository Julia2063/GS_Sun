import { useState, useEffect } from 'react';

export const LineChange = ({ data }) => {
   const [currentFuel, setCurrentFuel] = useState(null);

   console.log(currentFuel);

   useEffect(() => {
      const findedValue = Object.entries(data.oldData).find((el) => el[1] !== Object.entries(data.newData).find(e => e[0] === el[0])[1]);
      setCurrentFuel(findedValue[0]);
   }, [data]);

   const getProductName = () => {
    switch (currentFuel) {
      case '95':
        return ['95', 'Mustang'];

      case 'A-95':
        return ['A-95', 'Євро5'];

      case 'ДПe':
        return ['ДП', 'Євро5'];

      case 'ДП':
        return ['ДП', 'Mustang+'];
     
      default:
        return [currentFuel, ''] ;
    }
}

    return (
      <div className=" w-full h-12 flex flex-row items-center justify-between border-b border-l-2 border-r-2 border-['#E9E9E9'] bg-[#FAFAFA] ">
        <div className="w-1/4 pl-6">
          <span>{data.changeDate}</span>
        </div>
        <div className="w-1/4">
          <div className='text-lg font-bold '>{getProductName()[0]}</div>
          <div className='text-xs font-bold text-[#727272]'>{getProductName()[1]}</div>
        </div>
        <div className="w-1/4">
          <span>{data.oldData[currentFuel]}</span>
        </div>
        <div className="w-1/4">
          <span>{data.newData[currentFuel]}</span>
        </div>
      </div>
    );
  };