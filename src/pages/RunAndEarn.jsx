/* global BigInt */
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  TextField, 
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import { useVisibility } from '../hooks/useVisibility';
import { Web3 } from 'web3';
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import DaoABI from "../constants/DataFeedDAO.json";
import config from "../constants/config.json";
import { convertToUSDFromWei } from "../utils/convert";
import { toast } from "react-toastify";
import { fetchTransactions } from "../utils/web3/transactions";
import AutoModeIcon from '@mui/icons-material/AutoMode';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const RunAndEarn = () => {
  const location = useLocation();
  const apiInfo = location.state?.apiInfo;
  const isVisible = useVisibility();
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([]);
  const [newHeader, setNewHeader] = useState({
    name: '',
    value: ''
  });
  const [reclaimAppSecret, setReclaimAppSecret] = useState('');
  const [reclaimAppId, setReclaimAppId] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [costs, setCosts] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [stateMessage, setStateMessage] = useState('');
  const [formattedEarnings, setFormattedEarnings] = useState('0');
  const [formattedCosts, setFormattedCosts] = useState('0');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [submissionFrequency, setSubmissionFrequency] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(24); // hours to display, now can go up to 168
  const [isUrlExpanded, setIsUrlExpanded] = useState(false);
  
  useEffect(() => {
    if (apiInfo?.url) {
      setUrl(apiInfo.url);
    }
  }, [apiInfo]);

  const [runningSubmissions, setRunningSubmissions] = useState([]);

  const stats = {
    address: apiInfo?.lastSubmitter || 'N/A',
    name: apiInfo?.name || 'N/A',
    heartbeat: `${apiInfo?.updateCoolDown || 'N/A'} seconds`,
    submission_Reward: `$${apiInfo?.submissionReward || 'N/A'}`,
    data_RefreshWindow: `${apiInfo?.dataFreshnessWindow || 'N/A'} seconds`,
    number_Of_Contributions: apiInfo?.contributorsCount || 0,
    lastSubmitter: apiInfo?.lastSubmitter || 'N/A',
    instruction: 'You can earn money if you run this DataDAO using your secret key'
  };

  const [poolStats, setPoolStats] = useState({
    totalPool: '0',
    estimatedDaily: '0'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPoolStats = useCallback(async () => {
    try {
      const web3Instance = new Web3(config.networks["base-mainnet"].rpcEndpoint);
      const contract = new web3Instance.eth.Contract(
        DaoABI.abi,
        config.networks["base-mainnet"].contractAddress
      );

      const apiInfo = await contract.methods.getAPIInfo(url).call();
      const fund = await contract.methods.getDepositedFund(url).call();
      const totalPoolUSD = await convertToUSDFromWei(Number(fund));

      const submissionsPerDay = Math.floor(86400 / Number(apiInfo[2]));
      const dailyRewardUSD = await convertToUSDFromWei(Number(apiInfo[3]) * submissionsPerDay);

      setPoolStats({
        totalPool: totalPoolUSD.toFixed(2),
        estimatedDaily: dailyRewardUSD.toFixed(2)
      });

    } catch (error) {
      console.error('Error fetching pool stats:', error);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchPoolStats();
    }
  }, [url, fetchPoolStats]);

  // Add new header handler
  const handleAddHeader = () => {
    if (newHeader.name && newHeader.value) {
      setHeaders([...headers, newHeader]);
      setNewHeader({ name: '', value: '' });
    }
  };

  // Validate and set Reclaim App Secret
  const handleReclaimAppSecret = (event) => {
    const privateKey = event.target.value;
    setReclaimAppSecret(privateKey);
    
    if (privateKey === '') {
      setStateMessage(
        'You can obtain an App Secret (Private Key) from dev.reclaimprotocol.org'
      );
      return;
    }

    try {
      const web3Instance = new Web3(config.networks["base-mainnet"].rpcEndpoint);
      const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
      setReclaimAppId(account.address);
      
      // Check account balance
      web3Instance.eth.getBalance(account.address)
        .then(balance => {
          if (balance > 1e15) {
            setStateMessage(`Account ${account.address} ready for submissions`);
          } else {
            setStateMessage(`Warning: Low balance in ${account.address}. Please add funds for gas fees.`);
          }
        })
        .catch(() => {
          setStateMessage('Error checking account balance');
        });
    } catch {
      setStateMessage('Please input a correct secret key');
    }
  };

  // Auto-run submissions
  const toggleAutoRun = () => {
    if (!reclaimAppSecret) {
      toast.error('Please input a correct secret key');
      return;
    }
    setIsAutoRunning(!isAutoRunning);
  };

  // Run single submission
  const handleRun = useCallback(async () => {
    if (!reclaimAppSecret) {
      toast.error('Please input a correct secret key');
      return;
    }

    setIsSubmitting(true);
    try {
      const reclaimClient = new ReclaimClient(
        reclaimAppId,
        reclaimAppSecret
      );

      // Prepare headers
      const headerObj = {};
      headers.forEach(header => {
        headerObj[header.name] = header.value;
      });

      // Fetch data with proof
      const proof = await reclaimClient.zkFetch(
        url,
        {
          method: "GET",
          headers: {
            accept: "application/json, text/plain, */*"
          }
        },
        { headers: headerObj }
      );

      // Initialize Web3 and account
      const web3Instance = new Web3(config.networks["base-mainnet"].rpcEndpoint);
      const account = web3Instance.eth.accounts.privateKeyToAccount(reclaimAppSecret);
      web3Instance.eth.accounts.wallet.add(account);
      
      const contract = new web3Instance.eth.Contract(
        DaoABI.abi,
        config.networks["base-mainnet"].contractAddress
      );

      // Transform proof for on-chain submission
      const transformedProof = transformProofForContract(proof);
      
      // Estimate gas and get gas price
      const gasPrice = await web3Instance.eth.getGasPrice();
      const gasEstimate = await contract.methods
        .submitData(url, transformedProof.verifiedResponse, transformedProof.proof)
        .estimateGas({ from: account.address });

      // Submit transaction
      const tx = await contract.methods
        .submitData(url, transformedProof.verifiedResponse, transformedProof.proof)
        .send({ 
          from: account.address,
          gas: gasEstimate,
          gasPrice: gasPrice
        });

      // Calculate costs and earnings
      const gasCost = BigInt(tx.gasUsed) * BigInt(gasPrice);
      const submissionReward = BigInt(apiInfo.submissionReward || 0);
      
      setEarnings(prev => prev + Number(submissionReward));
      setCosts(prev => prev + Number(gasCost));

      // Add to running submissions
      const newSubmission = {
        date: new Date().toLocaleString(),
        hash: tx.transactionHash,
        cost: `$${await convertToUSDFromWei(gasCost)}`
      };

      setRunningSubmissions(prev => [newSubmission, ...prev]);
      toast.success('Data submitted successfully!');

    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Failed to submit data');
    } finally {
      setIsSubmitting(false);
    }
  }, [reclaimAppId, reclaimAppSecret, url, headers, apiInfo]);

  // Auto-run effect
  useEffect(() => {
    let interval;
    if (isAutoRunning) {
      handleRun();
      interval = setInterval(() => {
        handleRun();
      }, (apiInfo?.updateCoolDown || 60) * 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoRunning, handleRun, apiInfo?.updateCoolDown]);

  const transformProofForContract = (proof) => {
    // Transform proof into format expected by smart contract
    const verifiedResponse = JSON.parse(
      proof.claimData.parameters
    ).responseMatches[0].value.replaceAll('"', '\\"');

    const claimInfo = {
      context: proof.claimData.context,
      parameters: proof.claimData.parameters,
      provider: proof.claimData.provider
    };

    const signedClaim = {
      claim: {
        epoch: proof.claimData.epoch,
        identifier: proof.claimData.identifier,
        owner: proof.claimData.owner,
        timestampS: proof.claimData.timestampS
      },
      signatures: proof.signatures
    };

    return {
      verifiedResponse,
      proof: { claimInfo, signedClaim }
    };
  };

  // Update formatted values whenever earnings/costs change
  useEffect(() => {
    const updateFormatted = async () => {
      setFormattedEarnings(await convertToUSDFromWei(earnings));
      setFormattedCosts(await convertToUSDFromWei(costs));
    };
    updateFormatted();
  }, [earnings, costs]);

  // Add this function to fetch stats from events
  const fetchStats = useCallback(async () => {
    try {
      const now = Math.floor(Date.now() / 1000) * 1000;
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      const transactions = await fetchTransactions(1000);
      const submissionEvents = transactions.filter(tx => 
        tx.type === 'Submitted' && 
        tx.apiUrl === url &&
        Number(tx.timestamp) >= oneWeekAgo
      );

      // Store actual submission timestamps instead of frequency
      const submissions = submissionEvents.map(tx => ({
        timestamp: Number(tx.timestamp),
        from: tx.from
      }));
      
      setSubmissionFrequency(submissions);
      
      // Rest of the stats calculations...
      const uniqueUsers = new Set(submissionEvents.map(tx => tx.from));
      setTotalUsers(uniqueUsers.size);
      setTotalSubmissions(submissionEvents.length);

      // Calculate total earned...
      const web3Instance = new Web3(config.networks["base-mainnet"].rpcEndpoint);
      const contract = new web3Instance.eth.Contract(
        DaoABI.abi,
        config.networks["base-mainnet"].contractAddress
      );
      const apiInfo = await contract.methods.getAPIInfo(url).call();
      const rewardPerSubmission = BigInt(apiInfo[3] || 0);
      const totalEarnedWei = rewardPerSubmission * BigInt(submissionEvents.length);
      
      const earnedUSD = await convertToUSDFromWei(totalEarnedWei);
      setTotalEarned(earnedUSD);

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch submission statistics');
    }
  }, [url]);

  // Add useEffect to fetch stats
  useEffect(() => {
    if (url) {
      fetchStats();
    }
  }, [url, fetchStats]);

  const getVisibleData = () => {
    const now = Date.now();
    const visibleTimeframe = zoomLevel * 60 * 60 * 1000;
    const startTime = now - visibleTimeframe;
    const endTime = startTime + visibleTimeframe;
    
    return submissionFrequency.filter(submission => 
      submission.timestamp >= startTime && submission.timestamp <= endTime
    );
  };

  // Simplified wheel event handler
  useEffect(() => {
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
      const wheelHandler = (e) => {
        e.preventDefault();
        
        const zoomDelta = e.deltaY > 0 ? 1 : -1;
        setZoomLevel(prev => {
          // Calculate zoom step as 1/3 of current window
          const zoomStep = prev / 3;
          // Limit zoom between 1 hour and 168 hours (1 week)
          return Math.min(Math.max(prev + (zoomDelta * zoomStep), 1), 168);
        });
      };

      chartContainer.addEventListener('wheel', wheelHandler, { passive: false });
      chartContainer.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

      return () => {
        chartContainer.removeEventListener('wheel', wheelHandler);
        chartContainer.removeEventListener('touchmove', e => e.preventDefault());
      };
    }
  }, []);

  return (
    <Container maxWidth="xl" sx={{ 
      mt: { xs: 4, sm: 6, md: 8 }, 
      color: 'white',
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row'},
        gap: { xs: 3, md: 4 },
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <Box sx={{ 
          flex: '5', 
          maxWidth: { xs: '100%', md:'60%' }
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontStyle: "italic", 
              fontWeight: "bold", 
              fontSize: { xs: "32px", sm: "40px", md: "48px" } 
            }}
          >
            Run & Earn
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '14px', sm: '16px' }
            }}
          >
            Run this script to submit the latest data to the DAO and earn
          </Typography>

          <Box sx={{ mb: 4 }}>
            <TableContainer component={Paper} sx={{ 
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              padding: 2,
              fontSize: "12px !important",
              '& tr:last-child td': {
                borderBottom: 'none'
              }
            }}>
              <Table>
                <TableBody>
                  <TableRow sx={{ '& td': { color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <TableCell sx={{ pl: 3 }}>URL :</TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        pr: 3,
                        maxWidth: { xs: '200px', sm: '300px', md: '300px' }, // Responsive max width
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                      onClick={() => setIsUrlExpanded(!isUrlExpanded)}
                    >
                      <Box sx={{
                        position: 'relative',
                        width: '100%'
                      }}>
                        <a 
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ 
                            color: 'white', 
                            textDecoration: 'none',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: isUrlExpanded ? 'clip' : 'ellipsis',
                            whiteSpace: isUrlExpanded ? 'normal' : 'nowrap',
                            wordBreak: 'break-all'
                          }}
                        >
                          {url}
                        </a>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, float: 'right', fontSize: '11px' }}>
                          {isUrlExpanded ? (
                            <>
                              Click to collapse
                              <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                            </>
                          ) : (
                            <>
                              Click to expand
                              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <TableCell sx={{ pl: 3 }}>TOTAL POOL :</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>${poolStats.totalPool}</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <TableCell sx={{ pl: 3 }}>ESTIMATED EARNING PER DAY :</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>${poolStats.estimatedDaily}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Reclaim zkFetch App Secret</Typography>
            <TextField
              fullWidth
              type="password"
              value={reclaimAppSecret}
              onChange={handleReclaimAppSecret}
              placeholder="Enter your Reclaim App Secret"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'white' },
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2 
              }}
            >
              {stateMessage}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Secret Headers</Typography>
            
            {/* Headers Table */}
            <TableContainer component={Paper} sx={{ 
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              overflow: 'hidden',
              '& td': {
                maxWidth: '250px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              mb: 2
            }}>
              <Table>
                <TableBody>
                  {headers.map((header, index) => (
                    <TableRow key={index} sx={{ 
                      '& td': { 
                        color: 'white', 
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}>
                      <TableCell sx={{ pl: 3 }}>{header.name}</TableCell>
                      <TableCell sx={{ pr: 3 }}>{header.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add New Header Form */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              mb: 2 
            }}>
              <TextField
                placeholder="Header Name"
                value={newHeader.name}
                onChange={(e) => setNewHeader({ ...newHeader, name: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newHeader.name && newHeader.value) {
                    handleAddHeader();
                  }
                }}
                sx={{
                  flex: { xs: '1 1 100%', sm: 1 },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: 'white' },
                  }
                }}
              />
              <TextField
                placeholder="Header Value"
                value={newHeader.value}
                onChange={(e) => setNewHeader({ ...newHeader, value: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newHeader.name && newHeader.value) {
                    handleAddHeader();
                  }
                }}
                sx={{
                  flex: { xs: '1 1 100%', sm: 2},
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: 'white' },
                  }
                }}
              />
              <Button 
                onClick={handleAddHeader}
                variant="contained" 
                sx={{ 
                  bgcolor: 'white', 
                  gap: 1,
                  color: 'white',
                  boxShadow: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  border: '0px',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Box component="img" src="/add_header.svg" alt="Add header icon" sx={{ width: 20, height: 20 }} />
                New
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleRun}
              disabled={isSubmitting || isAutoRunning}
              sx={{ 
                bgcolor: 'white', 
                backgroundColor: 'rgba(255, 255, 255, 0)',
                color: (isSubmitting || isAutoRunning) ? 'rgba(255, 255, 255, 0.3)' : 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <>
                  <Box component="img" src="/run&earn.svg" alt="Run once" sx={{ width: 20, height: 20 }} />
                  Run Once
                </>
              )}
            </Button>

            <Button 
              variant="contained" 
              onClick={toggleAutoRun}
              sx={{ 
                bgcolor: isAutoRunning ? 'white' : 'rgba(255, 255, 255, 0)',
                color: isAutoRunning ? 'black' : 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: isAutoRunning ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                },
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <Box 
                component={isAutoRunning ? StopIcon : AutoModeIcon}
                sx={{ width: 20, height: 20 }} 
              />
              {isAutoRunning ? 'Stop Auto-Run' : 'Start Auto-Run'}
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <TableContainer component={Paper} sx={{ 
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1
            }}>
              <Table>
                <TableBody>
                  <TableRow sx={{ '& td': { color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <TableCell sx={{ pl: 3 }}>EARNING</TableCell>
                    <TableCell sx={{ color: 'green' }}>${formattedEarnings}</TableCell>
                    <TableCell>COST</TableCell>
                    <TableCell sx={{ pr: 3, color: 'red' }}>${formattedCosts}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mb: 4 }}>
            {runningSubmissions.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>Running Submissions</Typography>
                <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                  <Table>
                    <TableBody>
                      {runningSubmissions.map((submission, index) => (
                        <TableRow 
                          key={index} 
                          sx={{ 
                            '& td': { 
                              color: 'white', 
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:last-child td': {
                              borderBottom: 0
                            }
                          }}
                        >
                          <TableCell>{submission.date}</TableCell>
                          <TableCell>
                            <a 
                              href={`https://basescan.org/tx/${submission.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'white', textDecoration: 'none' }}
                            >
                              {submission.hash}
                            </a>
                          </TableCell>
                          <TableCell>{submission.cost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 4, mb: 5, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Left side - Stats Table */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <TableContainer component={Paper} sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0)',
                padding: { xs: 1, sm: 2 },
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                '& tr:last-child td': {
                  borderBottom: 'none'
                }
              }}>
                <Table>
                  <TableBody>
                    {Object.entries(stats).map(([key, value]) => (
                      <TableRow key={key} sx={{ '& td': { color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
                        <TableCell sx={{ textTransform: 'uppercase' }}>{key}:</TableCell>
                        <TableCell>
                          {key.toLowerCase().includes('address') || key === 'lastSubmitter' ? (
                            <a 
                              href={`https://basescan.org/address/${value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'white', textDecoration: 'none' }}
                            >
                              {value}
                            </a>
                          ) : value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Right side - Statistics Cards */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Users Card */}
                <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0)', color: 'white', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box component="img" src="/stats_users.svg" alt="Users" sx={{ width: 40, height: 40 }} />
                    <Typography variant="h7">USERS</Typography>
                    <Typography variant="h7">{totalUsers.toLocaleString()}</Typography>
                  </Box>
                </Paper>

                {/* Total Earned Card */}
                <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0)', color: 'white', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box component="img" src="/stats_total_earned.svg" alt="Earnings" sx={{ width: 40, height: 40 }} />
                    <Typography sx={{ fontSize: '12px', paddingTop: '5px' }}>TOTAL EARNED</Typography>
                    <Typography variant="h7">${totalEarned.toLocaleString()}</Typography>
                  </Box>
                </Paper>

                {/* Submissions Card */}
                <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0)', color: 'white', textAlign: 'center', gridColumn: '1 / -1', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box component="img" src="/stats_submissions.svg" alt="Submissions" sx={{ width: 40, height: 40 }} />
                    <Typography variant="h7">SUBMISSIONS</Typography>
                    <Typography variant="h7">{totalSubmissions.toLocaleString()}</Typography>
                  </Box>
                </Paper>

                {/* Enhanced Submission Frequency Chart */}
                <Paper 
                  className="chart-container"
                  sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(0, 0, 0, 0)', 
                    color: 'white', 
                    gridColumn: '1 / -1', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>Submission Frequency</Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: 'auto',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ 
                      position: 'relative',
                      height: '20px',
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                    }}>
                      {getVisibleData().map((submission, i) => {
                        const now = Date.now();
                        const timeframe = zoomLevel * 60 * 60 * 1000;
                        const startTime = now - timeframe;
                        
                        // Calculate position relative to visible window
                        let xPosition = ((submission.timestamp - startTime) / timeframe) * 100;
                        
                        // Clamp position between 0 and 100
                        xPosition = Math.max(0, Math.min(100, xPosition));
                        
                        return (
                          <Box
                            key={i}
                            sx={{
                              position: 'absolute',
                              left: `${xPosition}%`,
                              bottom: 0,
                              width: '1px',
                              height: '20px',
                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                bgcolor: 'white',
                                '& .tooltip': {
                                  display: 'block'
                                }
                              },
                            }}
                          >
                            <Box
                              className="tooltip"
                              sx={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'none',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap',
                                zIndex: 1,
                                fontSize: '12px',
                                width: 'max-content',
                                textAlign: 'center'
                              }}
                            >
                              {new Date(submission.timestamp).toLocaleTimeString()}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Time labels */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mt: 1,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      pt: 1
                    }}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const now = Date.now();
                        const timeframe = zoomLevel * 60 * 60 * 1000;
                        const startTime = now - timeframe;
                        const labelTime = startTime + (i * (timeframe / 4));
                        
                        return (
                          <Typography key={i} variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', width: 'max-content', textAlign: 'center' }}>
                            {new Date(labelTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        );
                      })}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{
          flex: '3',
          position: { xs: 'static', md: 'fixed' },
          top: '200px',
          right: '100px',
          mt: { xs: 4, md: 0 },
          display: { xs: 'none', sm: 'block' } // Hide on mobile
        }}>
          <img 
            src="/run&earn_back.svg" 
            alt="Run and Earn"
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              borderRadius: '8px'
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default RunAndEarn; 