import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/profileSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="relative pt-12 pb-32 bg-blueGray-800">
        <div className="px-4 md:px-6 mx-auto w-full">
          <div className="flex flex-wrap">
            {/* Profile and Performance */}
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-gray-800 rounded-lg mb-6 shadow-lg">
                <div className="flex-auto p-4">
                  <div className="flex flex-wrap">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 className="text-red-400 uppercase font-bold text-xs">PERFORMANCE</h5>
                      <span className="font-bold text-xl">49.65%</span>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-black p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-lightBlue-500">
                        <i className="fas fa-percent"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blueGray-500 mt-4">
                    <span className="text-emerald-500 mr-2">
                      <i className="fas fa-arrow-up"></i> 12%
                    </span>
                    <span className="whitespace-nowrap">Since last month</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="px-4 md:px-6 mx-auto w-full -mt-24">
              <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-blueGray-800">
                    <div className="rounded-t bg-transparent px-4 py-3">
                      <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                          <h6 className="uppercase mb-1 text-xs font-semibold text-blueGray-200">Overview</h6>
                          <h2 className="text-xl font-semibold text-black">Sales value</h2>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-auto">
                      <div className="relative h-72">
                        <canvas id="line-chart"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full xl:w-4/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-gray-800">
                    <div className="rounded-t bg-transparent px-4 py-3">
                      <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                          <h6 className="uppercase mb-1 text-xs font-semibold text-white-500">Performance</h6>
                          <h2 className="text-xl font-semibold text-white-800">Total orders</h2>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-auto">
                      <div className="relative h-72">
                        <canvas id="bar-chart"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Visits Table */}
              <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-gray-800 text-blueGray-700">
                    <div className="px-6 py-4 border-0">
                      <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                          <h3 className="font-bold text-lg text-blueGray-700">Page visits</h3>
                        </div>
                      </div>
                    </div>
                    <div className="block w-full overflow-x-auto">
                      <table className="w-full bg-transparent border-collapse">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Page name</th>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Visitors</th>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Unique Users</th>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Bounce Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="font-bold">/argon/</span>
                              </div>
                            </td>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">4,569</div>
                            </td>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">340</div>
                            </td>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">
                                <i className="fas fa-arrow-up mr-2 text-emerald-500"></i>46.53%
                              </div>
                            </td>
                          </tr>
                          {/* More rows here */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Social Traffic Table */}
                <div className="w-full xl:w-4/12 px-4">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-gray text-blueGray-700">
                    <div className="px-6 py-4 border-0">
                      <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                          <h3 className="font-bold text-lg text-blueGray-700">Social traffic</h3>
                        </div>
                      </div>
                    </div>
                    <div className="block w-full overflow-x-auto">
                      <table className="w-full bg-transparent border-collapse">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Referral</th>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Visitors</th>
                            <th className="px-6 py-3 text-xs uppercase font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="font-bold">Facebook</span>
                              </div>
                            </td>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">1,480</div>
                            </td>
                            <td className="border-t-0 px-6 py-4 text-xs whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="mr-2">60%</span>
                                <div className="relative w-full">
                                  <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500" style={{ width: '60%' }}></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          {/* More rows here */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="block py-4 bg-blueGray-800">
                <div className="container mx-auto px-4">
                  <hr className="mb-4 border-blueGray-200" />
                  <div className="flex flex-wrap items-center md:justify-between justify-center">
                    <div className="w-full md:w-4/12 px-4">
                      <div className="text-center mb-2 md:text-left md:mb-0">
                        <a
                          href="https://www.creative-tim.com/?ref=npr-footeradmin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blueGray-500 font-semibold"
                        >
                          Copyright © 2021 Creative Tim
                        </a>
                      </div>
                    </div>
                    <div className="w-full md:w-8/12 px-4">
                      <ul className="flex flex-wrap list-none md:justify-end justify-center">
                        <li>
                          <a
                            href="https://www.creative-tim.com?ref=npr-footeradmin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3"
                          >
                            Creative Tim
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.creative-tim.com/presentation?ref=npr-footeradmin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3"
                          >
                            About Us
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.creative-tim.com/blog/?ref=npr-footeradmin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3"
                          >
                            Blog
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.creative-tim.com/license?ref=npr-footeradmin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3"
                          >
                            Licenses
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
