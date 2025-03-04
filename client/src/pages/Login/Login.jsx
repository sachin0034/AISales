import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveadmin } from "../../features/Admin";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Login.css";
import Spinnerf from "../../components/Spinnerf";
import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { REACT_APP_BACK_URL } from "../../config/config";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedAdminData = useSelector((state) => state.admin);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (persistedAdminData) {
      setAdminFormData({
        email: persistedAdminData.email || "",
        password: "",
      });
    }
  }, [persistedAdminData]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
  });

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: value,
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `${REACT_APP_BACK_URL}/admin/login`,
        adminFormData
      );
      dispatch(
        saveadmin({
          email: response.data.email,
          token: response.data.token,
        })
      );
      navigate(`/dashboard`);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="error"
        >
          {error.response.data.error}
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <section
      className="w-screen h-screen flex md:flex-col justify-center items-center gap-6"
      id="login"
    >
      {loading && <Spinnerf />} <Stack spacing={2}>{alert}</Stack>
      <form
        onSubmit={handleAdminSubmit}
        className="rounded md:w-11/12 w-1/3 p-12 flex flex-col gap-3 md:p-6"
        style={{ backgroundColor: "white" }}
      >
        <p className="text-black text-3xl font-semibold text-center">
          ADMIN LOGIN
        </p>
        <TextField
          id="admin-email"
          variant="outlined"
          type="email"
          name="email"
          value={adminFormData.email}
          label="Email ID"
          onChange={handleAdminChange}
          className="w-full rounded form-input"
          required
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="admin-password">Password</InputLabel>
          <OutlinedInput
            id="admin-password"
            className="w-full rounded form-input"
            type={showPassword ? "text" : "password"}
            value={adminFormData.password}
            onChange={handleAdminChange}
            name="password"
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <button
          type="submit"
          className="bg-blue border-1 border-solid border-blue text-white rounded w-full py-3 hero-hover-animated-button"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;
