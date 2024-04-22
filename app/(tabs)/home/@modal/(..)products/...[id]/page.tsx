import CloseButton from "@/components/close-button";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default async function Modal({ params }: { params: { id: string } }) {
  return (
    <div className="z-50 absolute w-full h-full left-0 top-0 bg-black bg-opacity-60 flex justify-center items-center">
      <CloseButton />
      <div className="max-w-screen-sm w-full  h-1/2 flex justify-center">
        <div className="aspect-square bg-neutral-700 border-neutral-700 rounded-md flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
