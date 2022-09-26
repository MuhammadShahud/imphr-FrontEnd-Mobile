import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'native-base';
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, PlatformColor, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyHeader from '../components/MyHeader';
import config from '../config';
import * as RNIap from 'react-native-iap';
import { LogoutAction, UpdateAction } from '../redux/actions';
import { connect } from 'react-redux';
import { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';

const productIds = Platform.select({
  ios: [
    'com.imphr.monthlysub',
    'com.imphr.yearlysub'
  ],
  android: [
    'com.imphr.monthlysub',
    'com.imphr.yearlysub'
  ]
});

export class SuscriptionPlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionPlans: [],
      products: [],
      selected_sku: "",
      user: null,
      loading: false,
      loadingProducts: true
    };
  }

  purchaseUpdateSubscription = null
  purchaseErrorSubscription = null


  async componentDidMount() {
    // AsyncStorage.getItem("IMPHR@USER", (error, result) => {
    //   if (!error) {
    //     if (result) {
    //       let user = JSON.parse(result);
    //      console.warn(user)
    //     }
    //   }
    // })
    if (!this.props.user?.user) {
      return;
    }
    RNIap.initConnection().then(async () => {
      this.onRefresh();
      RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
      }).then(() => {
        this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase | RNIap.ProductPurchase) => {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            var data = {
              id: this.props.user.user.id,
              subscription_type: Platform.OS == "android" ? "google" : "apple",
              subscription_id: this.state.selected_sku
            };
            const res = await config.postApi(config.apiSubscribe(), config.defaultHeaders, JSON.stringify(data));
            if (res) {
              this.setState({ loading: false });
              AsyncStorage.setItem("IMPHR@USER", JSON.stringify({ user: res.user, token: this.props.user.token }))
              this.props.UpdateUser({ user: res.user, token: this.props.user.token })
            }
            else {
              alert("Error")
            }
            // yourAPI.deliverOrDownloadFancyInAppPurchase(purchase.transactionReceipt)
            // .then( async (deliveryResult) => {
            //   if (isSuccess(deliveryResult)) {
            //     // Tell the store that you have delivered what has been paid for.
            //     // Failure to do this will result in the purchase being refunded on Android and
            //     // the purchase event will reappear on every relaunch of the app until you succeed
            //     // in doing the below. It will also be impossible for the user to purchase consumables
            //     // again until you do this.
            //    

            //     // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
            //     // If consumable (can be purchased again)
            //     await RNIap.finishTransaction(purchase, true);
            //     // If not consumable
            //     await RNIap.finishTransaction(purchase, false);
            //   } else {
            //     // Retry / conclude the purchase is fraudulent, etc...
            //   }
            // });
          }
        });

        this.purchaseErrorSubscription = purchaseErrorListener((error: RNIap.PurchaseError) => {
          console.warn('purchaseErrorListener', error);
        });
      })
    })

  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  }

  // subscribePlan = async () => {
  //   let { user } = this.state;
  //   if (!user.default_card) {
  //     alert("Please add or set payment method");
  //     return;
  //   }
  //   this.setState({ loading: true })
  //   const res = await config.getApi(config.apiSubscribe(), config.defaultHeaders);
  //   if (res) {

  //   }
  //   this.setState({ loading: false })
  // }

  // getPlans = async () => {
  //   this.setState({ loading: true })
  //   const res = await config.getApi(config.apiAllPlans(), config.defaultHeaders);
  //   if (res)
  //     this.setState({ loading: false, subscriptionPlans: res.data });
  // }

  renderPlans = ({ item }) => {
    let subData = Platform.OS == "android" ? item?.originalJson ? JSON.parse(item?.originalJson) : null : item;
    //subData.price_currency_code + " " + 
    return (
      <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.subscriptonContainer} >
        <View
        >
          <Text
            style={[
              styles.title,
            ]}>
            {subData?.title ? subData?.title : item?.productId.includes("monthly")?"Monthly Subscription":"Yearly Subscription"}
          </Text>
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              marginBottom: 10
            }}
          >
            {subData?.description ? subData?.description : "For ad free version"}
          </Text>
          <View style={styles.currencyIcon}>
            <Text
              style={[
                styles.priceText,
                {
                  marginEnd: 5
                },
              ]}>{subData?.localizedPrice ? subData?.localizedPrice: subData?.price}{Platform.OS=="ios"?<Text style={{fontSize:12}}>{(item?.productId.includes("monthly")? " / per month":" / per year")}</Text>:null}</Text>
          </View>

          <View
            style={{
              marginVertical: 12,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={() => this.requestSubscription(item?.productId)}
              style={[
                styles.subscribeBtn,
                {
                  backgroundColor: "#fff",
                },
              ]}>
              {
                subData?.productId == this.props.user?.user?.subscription_id ?
                  <Text style={{ color: "#ddd" }}>Subscribed</Text>
                  :
                  <Text>Subscribe</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    )
  }

  requestSubscription = async (sku) => {
    try {
      
      if (!this.props.user) {
        this.props.Logout();
        return;
      }
      await RNIap.requestSubscription(sku);
      this.setState({ selected_sku: sku, loading: true })
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  onRefresh = async () => {
    try {
      const products: RNIap.Subscription[] = await RNIap.getSubscriptions(productIds);
      console.warn(products)
      this.setState({ products, loadingProducts: false });
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    if (!this.props.user?.user) {
      return (
        <View style={styles.container}>
          <MyHeader title="Subscription Plans" navigation={this.props.navigation} drawer />

          <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", }}>
            <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonCon}>
              <TouchableOpacity onPress={this.props.Logout} style={styles.button}>
                <Text style={{ color: this.state.loading ? "#cccc" : "#fff", fontSize: 17 }}>LOGIN</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

        </View>
      )
    }
    return (
      <View style={styles.container}>
        <MyHeader title="Subscription Plans" navigation={this.props.navigation} drawer />

        <FlatList
          onRefresh={this.onRefresh}
          refreshing={this.state.loadingProducts}
          style={{ flex: 1 }}
          data={this.state.products}
          renderItem={this.renderPlans}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatBtn: {
    marginVertical: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptonContainer: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 20,
    marginVertical: 9,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff"
  },
  currencyIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeBtn: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 3 },
  priceText: { fontSize: 20, fontWeight: 'bold', color: "#fff" },
  btnText: { paddingLeft: 5, fontSize: 16 },
  button: {
    padding: 15,
    ...Platform.OS == "android" ?
      {
        flex: 1,
      } : {},
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCon: {
    width: "90%",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden"
  }
});

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  UpdateUser: (user) => dispatch(UpdateAction(user)),
  Logout: () => dispatch(LogoutAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(SuscriptionPlans);
