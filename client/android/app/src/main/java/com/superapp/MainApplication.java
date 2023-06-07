package com.superapp;

import android.app.Application;
import android.content.Context;

import androidx.multidex.MultiDex;

import com.facebook.cache.disk.DiskCacheConfig;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.soloader.SoLoader;


import java.util.List;


public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            Context context = getApplicationContext();

            DiskCacheConfig diskCacheConfig = DiskCacheConfig.newBuilder(context)
                    .setBaseDirectoryPath(context.getCacheDir())
                    .setBaseDirectoryName("DKImages")
                    .setMaxCacheSize(50 * 1024 * 1024)
                    .build();



            List<ReactPackage> packages = new PackageList(this).getPackages();
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
    };

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }


    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
        sharedI18nUtilInstance.allowRTL(getApplicationContext(), true);
        sharedI18nUtilInstance.forceRTL(getApplicationContext(), true);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
          // If you opted-in for the New Architecture, we load the native entry point for this app.
          DefaultNewArchitectureEntryPoint.load();
        }
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }
}
