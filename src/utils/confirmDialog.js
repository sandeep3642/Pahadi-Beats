// ConfirmDialog.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirmDialog = (title = 'Are you sure?', message = 'Do you want to proceed?') => {
  return MySwal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3490dc', // Tailwind blue-500
    cancelButtonColor: '#e3342f', // Tailwind red-500
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'Cancel',
    customClass: {
      container: 'text-white bg-gray-800 p-4 rounded shadow-lg',
      title: 'text-gray-800 font-bold',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
      cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded',
    },
  }).then((result) => {
    return result.isConfirmed;
  });
};
