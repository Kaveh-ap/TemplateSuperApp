package com.superapp;


import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;

import androidx.annotation.Nullable;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import com.facebook.react.modules.i18nmanager.I18nUtil;


// for applyOverrideConfiguration

public class MainActivity extends ReactActivity {

    private Handler handler = new Handler();

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "d";
    }
    
     /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }
    // Workaround appcompat-1.1.0 bug https://issuetracker.google.com/issues/141132133
    @Override
    public void applyOverrideConfiguration(Configuration overrideConfiguration) {
        if (Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT <= 25) {
            return;
        }
        super.applyOverrideConfiguration(overrideConfiguration);
    }



    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(null);


        I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
        sharedI18nUtilInstance.forceRTL(this, true);
        sharedI18nUtilInstance.allowRTL(this, true);

        final Handler handler = new Handler();
        handler.postDelayed(() -> {
            // Do something after 5s = 5000ms
            getWindow().getDecorView().setBackgroundColor(Color.WHITE);
        }, 3000);

        Uri data = null;
        String action = null;
        Bundle extras = null;

        Intent currentIntent = getIntent();
        if (currentIntent != null) {
            Uri intentData = currentIntent.getData();
            if (intentData != null) {
                data = intentData;
            }

            extras = currentIntent.getExtras();

            action = currentIntent.getAction();
        }

        Intent intent = new Intent(this, MainActivity.class);
        if (data != null) {
            intent.setData(data);
        }
        if (action != null) {
            intent.setAction(action);
        }
        if (extras != null) {
            intent.replaceExtras(extras);
        }

        this.setIntent(intent);
    }


}
