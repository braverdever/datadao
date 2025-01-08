import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Web3 } from "web3";
import DashboardCard from '../components/DashboardCard';
import DaoABI from "../constants/DataFeedDAO.json";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import config from "../constants/config.json";
import { convertToUSDFromWei } from "../utils/convert";

const DaoList = () => {
  const network = config.networks["base-mainnet"];
  const rpcEndpoint = network.rpcEndpoint;
  const contractAddress = network.contractAddress;
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    dataSources: 0,
    totalEarned: 0,
    submissions: 0
  });

  const init = async () => {
    const web3Instance = new Web3(rpcEndpoint);
    setIsLoading(true);
    try {
      const contractABI = DaoABI.abi;
      const contract = new web3Instance.eth.Contract(
        contractABI,
        contractAddress
      );
      const apiListLength = await contract.methods.getAPIListLength().call();
      let data = [];
      for (let i = 0; i < apiListLength; i++) {
        const url = await contract.methods.getAPIUrlfromID(i).call();
        const apiInfo = await contract.methods.getAPIInfo(url).call();
        data.push({
          id: i,
          url,
          name: apiInfo[0],
          description: apiInfo[1],
          updateCoolDown: Number(apiInfo[2]),
          submissionReward: Number(apiInfo[3]),
          dataFreshnessWindow: Number(apiInfo[4]),
          currentTick: Number(apiInfo[5]),
          contributorsCount: Number(apiInfo[6]),
          lastSubmitter: apiInfo[7],
          lastSubmissionTime: Number(apiInfo[8]) * 1000
        });
      }
      setRows(data);
      
      const totalEarnedUSD = await convertToUSDFromWei(
        data.reduce((acc, row) => acc + row.submissionReward, 0)
      );
      
      setStats({
        users: data.reduce((acc, row) => acc + row.contributorsCount, 0),
        dataSources: data.length,
        totalEarned: totalEarnedUSD,
        submissions: data.reduce((acc, row) => acc + row.currentTick, 0)
      });
    } catch (error) {
      console.log(error);
      toast.error("Error fetching API list");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (rpcEndpoint === undefined) return;
    init();
  }, [rpcEndpoint]);

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: '5%',
          pl: '0%',
          pb: '100px',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          gap: 4,
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <Box sx={{ flex: '0 0 60%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                color: 'white',
                fontSize: '48px',
                fontWeight: 600,
                letterSpacing: '1px',
                fontStyle: 'italic'
              }}
            >
              DAO List
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={goToRegister}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.0)',
                  color: 'white',
                  borderRadius: '0px',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                <Box
                  component="img"
                  src="/button_create.svg"
                  alt="Create icon"
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                Create
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 3, 
            mb: 4 
          }}>
            <StatsCard title="USERS" value={stats.users} />
            <StatsCard title="DATA SOURCES" value={stats.dataSources} />
            <StatsCard title="TOTAL EARNED" value={`$${stats.totalEarned.toLocaleString()}`} />
            <StatsCard title="SUBMISSIONS" value={stats.submissions.toLocaleString()} />
          </Box>

          {isLoading ? (
            <Box sx={{ paddingTop: "50px", width: "100%", textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(430px, 1fr))',
              gap: 3 
            }}>
              {rows.map(row => (
                <DashboardCard key={row.id} data={row} />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ 
          flex: '0 0 40%',
          position: 'fixed',
          top: '250px',
          right: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box 
            component="img"
            src="/daolist.svg"
            alt="DAO Illustration"
            sx={{
              width: '600px',
              height: 'auto',
              marginTop: '0'
            }}
          />
        </Box>
      </Box>
      <ToastContainer/>
    </Container>
  );
};

const StatsCard = ({ title, value }) => (
  <Box sx={{
    padding: '20px',
    overflow: 'hidden',
    border: '2px solid rgba(255, 255, 255, 0.1)'
  }}>
    <Box
      component="img"
      src={`/stats_${title.toLowerCase().replace(' ', '_')}.svg`}
      alt={`${title} icon`}
      sx={{ width: 40, height: 40 }}
    />
    <Box sx={{ color: 'white', fontSize: '14px' }}>{title}</Box>
    <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{value}</Box>
  </Box>
);

export default DaoList; 