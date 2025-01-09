import React, { useEffect, useCallback, useState } from "react";
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
import { fetchTransactions } from "../utils/web3/transactions";

const DaoList = () => {
  const network = config.networks["base-mainnet"];
  const rpcEndpoint = network.rpcEndpoint;
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    dataSources: 0,
    totalEarned: 0,
    submissions: 0
  });

  const init = useCallback(async () => {
    if (rpcEndpoint === undefined) return;
    
    const web3Instance = new Web3(rpcEndpoint);
    setIsLoading(true);
    try {
      const txs = await fetchTransactions(1000);

      const contract = new web3Instance.eth.Contract(
        DaoABI.abi,
        config.networks["base-mainnet"].contractAddress
      );
      
      const apiListLength = await contract.methods.getAPIListLength().call();
      let data = [];
      let submissionReward = 0;

      for (let i = 0; i < apiListLength; i++) {
        const url = await contract.methods.getAPIUrlfromID(i).call();
        const apiInfo = await contract.methods.getAPIInfo(url).call();
        submissionReward = Number(apiInfo[3]);
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
      
      const submittedTotal = txs
        .filter(tx => tx.type === 'Submitted')
        .length * submissionReward;
      
      const totalEarnedUSD = await convertToUSDFromWei(submittedTotal);
      
      setStats({
        users: data.reduce((acc, row) => acc + row.contributorsCount, 0),
        dataSources: data.length,
        totalEarned: totalEarnedUSD,
        submissions: txs.filter(tx => tx.type === 'Submitted').length
      });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching data");
    }
    setIsLoading(false);
  }, [rpcEndpoint]);

  useEffect(() => {
    init();
  }, [init]);

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: { xs: '15%', sm: '10%', md: '5%' },
          pl: { xs: '5%', sm: '5%', md: '0%' },
          pb: '100px',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4
        }}
      >
        <Box sx={{ 
          flex: { xs: '1', lg: '0 0 60%' },
          width: '100%'
        }}>
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
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(140px, 1fr))',
              sm: 'repeat(auto-fill, minmax(200px, 1fr))',
              md: 'repeat(auto-fill, minmax(430px, 1fr))'
            },
            gap: 3 
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
              paddingTop: '50px',
              display: 'grid', 
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(140px, 1fr))',
                sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                md: 'repeat(auto-fill, minmax(430px, 1fr))'
              },
              gap: 3 
            }}>
              {rows.map(row => (
                <DashboardCard key={row.id} data={row} />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ 
          flex: { xs: '1', lg: '0 0 40%' },
          position: { xs: 'static', lg: 'fixed' },
          top: '250px',
          right: '150px',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: -1
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