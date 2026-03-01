# Aboud Bus Booking System - Deployment Guide

## 🚀 Quick Deployment

### Frontend (Vercel)
1. Push frontend to GitHub
2. Connect repository to Vercel
3. Vercel will automatically build and deploy

### Backend (Render/Heroku/DigitalOcean)
1. Push backend to GitHub
2. Connect to your hosting platform
3. Set environment variables from `.env.example`
4. Deploy!

## 📋 Environment Variables

### Backend
```bash
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,*.vercel.app
DB_NAME=aboud_bus_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
```

### Frontend
Update `src/services/api.js` to point to your backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🔧 Configuration Files

### Production Ready Files:
- `requirements.txt` - All dependencies
- `Procfile` - For deployment platforms
- `.env.example` - Environment variables template
- `deploy.sh` - Deployment script
- `vercel.json` - Vercel configuration

## 🌐 Deployment Steps

### 1. Prepare Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

### 2. Prepare Frontend
```bash
cd frontend
npm install
npm run build
```

### 3. Deploy
- **Frontend**: Vercel (recommended)
- **Backend**: Render, Heroku, or DigitalOcean

## 🔗 Connecting Frontend to Backend

Update the API base URL in `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-domain.com/api', // Update this
  timeout: 10000,
});
```

## ✅ Post-Deployment Checklist

- [ ] Backend API accessible
- [ ] Frontend can reach backend
- [ ] CORS configured properly
- [ ] Static files serving
- [ ] Database connected
- [ ] JWT tokens working
- [ ] PDF generation working

## 🐛 Common Issues

### CORS Issues
- Check `CORS_ALLOWED_ORIGINS` in settings
- Verify frontend URL is allowed
- Check `CSRF_TRUSTED_ORIGINS`

### Database Issues
- Run migrations: `python manage.py migrate`
- Check database credentials
- Verify database is accessible

### Static Files
- Run: `python manage.py collectstatic`
- Check `STATIC_ROOT` configuration
- Verify static file serving

## 📞 Support

For deployment issues:
1. Check logs on your hosting platform
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
