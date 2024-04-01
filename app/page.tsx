export default function Home() {
  return (
    <main className="bg-slate-300 h-screen flex items-center justify-center p-5">
      <div className="bg-white shadow-lg p-5 rounded-2xl w-full">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-600 font-semibold -mb-1">
                In Transit
              </span>
              <span className="font-semibold text-4xl">Coolblue</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-300" />
          </div>

          <div className="my-2 flex items-center gap-2">
            <span className="bg-green-400 px-2 py-1 text-white uppercase text-xs font-medium rounded-xl">
              Today
            </span>
            <span>9:30-10:30</span>
          </div>

          <div className="relative">
            <div className="bg-gray-200 w-full h-2 rounded-full absolute"></div>
            <div className="bg-green-400 w-2/3 h-2 rounded-full absolute"></div>
          </div>
          <div className="flex justify-between mt-5 text-gray-600">
            <span>Expected</span>
            <span>Sorting center</span>
            <span>In Transit</span>
            <span className="text-gray-400">Delivered</span>
          </div>
        </div>
      </div>
    </main>
  );
}
