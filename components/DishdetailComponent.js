import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredSubtitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={styles.iconContainer}>
          <Icon
            raised
            reverse
            name={props.favorite ? 'heart' : 'heart-o'}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log('Already favorite') : props.onPress()
            }
          />
          <Icon
            raised
            reverse
            name="pencil"
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.toggleModal()}
          />
        </View>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {'--' + item.author + ', ' + item.date}
        </Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
  );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 4,
      author: '',
      comment: '',
      showModal: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  handleComment() {
    this.resetForm();
    this.toggleModal();
    this.props.postComment(
      this.props.navigation.getParam('dishId', ''),
      this.state.rating,
      this.state.author,
      this.state.comment
    );
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      rating: 4,
      author: '',
      comment: '',
    });
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  static navigationOptions = {
    title: 'Dish Details',
  };

  render() {
    const dishId = this.props.navigation.getParam('dishId', '');
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          toggleModal={this.toggleModal}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === dishId
          )}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal();
            this.resetForm();
          }}
          onRequestClose={() => {
            this.toggleModal();
            this.resetForm();
          }}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue={this.state.rating}
              onFinishRating={(rating) => this.setState({ rating: rating })}
            />
            <Input
              containerStyle={{ marginTop: 10, marginBottom: 10 }}
              placeholder="Author"
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              leftIconContainerStyle={{ marginRight: 10 }}
              value={this.state.author}
              onChangeText={(author) => this.setState({ author: author })}
            />
            <Input
              containerStyle={{ marginTop: 10, marginBottom: 10 }}
              placeholder="Comment"
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              leftIconContainerStyle={{ marginRight: 10 }}
              value={this.state.comment}
              onChangeText={(comment) => this.setState({ comment: comment })}
            />
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => {
                  this.handleComment();
                }}
                color="#512DA8"
                title="SUBMIT"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="grey"
                title="CANCEL"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
