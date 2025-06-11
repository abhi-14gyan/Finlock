import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AccountsPage = () => {
  const { accountId } = useParams();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/account/${accountId}`, {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          setAccountData(response.data.data);
        } else {
          setError('Account not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch account details');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [accountId]);
  console.log(accountData);
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{accountData.name}</h1>
      <p className="text-lg">Type: {accountData.type}</p>
      <p className="text-lg">Balance: ₹{accountData.balance.toFixed(2)}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Transactions ({accountData._count.transactions})</h2>
        {accountData.transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul className="space-y-2">
            {accountData.transactions.map((txn) => (
              <li key={txn._id} className="border-b py-2 flex justify-between">
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleString()}</p>
                </div>
                <p className={`font-semibold ${txn.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹{txn.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
